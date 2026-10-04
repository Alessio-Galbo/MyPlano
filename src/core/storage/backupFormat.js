import { DATA_KEYS as K, ALL_DATA_KEYS } from './storageKeys';
import { validateBackupData, validateAttachments } from './backupValidation';
import { CURRENT_SCHEMA_VERSION } from './migrations';
import { readRaw } from './safeStorage';
import { INITIAL_PROFILES, INITIAL_DOCUMENTS, INITIAL_EXPENSES } from './initialData';

export const BACKUP_FORMAT = 'myplano-backup';
export const BACKUP_VERSION = 3;
export const APP_VERSION = '0.1.0';

// Version <= 2 backups had one field per data type instead of a `data` map.
const LEGACY_FIELDS = {
  profiles: K.PROFILES, documents: K.DOCUMENTS, expenses: K.EXPENSES,
  initialBalance: K.INITIAL_BALANCE, monthlyIncome: K.MONTHLY_INCOME,
  profileFunds: K.PROFILE_FUNDS, profileFundConfigs: K.PROFILE_FUND_CONFIGS,
  profileIncomes: K.PROFILE_INCOMES, profileIncomeConfigs: K.PROFILE_INCOME_CONFIGS,
};

function parseRaw(raw) {
  try { return JSON.parse(raw); } catch { return raw; }
}

// Only DATA keys: UI preferences and myplano_corrupt_* safety copies are never exported.
export function readAllDataKeys() {
  const out = {};
  ALL_DATA_KEYS.forEach((key) => { out[key] = readRaw(key); });
  return out;
}

export function buildBackup(attachments, raws = readAllDataKeys()) {
  const data = {};
  Object.entries(raws).forEach(([key, raw]) => {
    if (raw !== null) data[key] = parseRaw(raw);
  });
  // A never-saved list is shown as the sample data: export what the user sees.
  data[K.PROFILES] ??= INITIAL_PROFILES;
  data[K.DOCUMENTS] ??= INITIAL_DOCUMENTS;
  data[K.EXPENSES] ??= INITIAL_EXPENSES;
  const backup = { format: BACKUP_FORMAT, version: BACKUP_VERSION, appVersion: APP_VERSION, exportedAt: new Date().toISOString(), data };
  if (attachments) backup.attachments = attachments;
  return backup;
}

// Emergency copy of the data as it was before a failed import (same format as a backup).
export function snapshotToBackupJson(snapshot) {
  return JSON.stringify(buildBackup(undefined, snapshot), null, 2);
}

function legacyToData(obj) {
  const data = {};
  Object.entries(LEGACY_FIELDS).forEach(([field, key]) => {
    if (obj[field] !== undefined && obj[field] !== null) data[key] = obj[field];
  });
  return data;
}

const fail = (error) => ({ ok: false, error });

// Turns the text of a backup file into { ok, data, attachments, meta } or { ok: false, error }.
// `error` is a code translated by the UI (common.backup.err*).
export function parseBackup(text) {
  let obj;
  try { obj = JSON.parse(text); } catch { return fail('invalidJson'); }
  if (!obj || typeof obj !== 'object' || Array.isArray(obj)) return fail('invalidFormat');
  const version = Number(obj.version);
  if (!Number.isInteger(version) || version < 1) return fail('invalidFormat');
  if (version > BACKUP_VERSION) return fail('newerVersion');
  const data = version >= 3 ? obj.data : legacyToData(obj);
  if (!data || typeof data !== 'object' || Array.isArray(data)) return fail('invalidFormat');
  const dataError = validateBackupData(data);
  if (dataError) return fail(dataError);
  if (Number(data[K.SCHEMA_VERSION] ?? 0) > CURRENT_SCHEMA_VERSION) return fail('newerVersion');
  const attachments = obj.attachments ?? [];
  if (!validateAttachments(attachments)) return fail('invalidAttachments');
  const count = (key) => (Array.isArray(data[key]) ? data[key].length : 0);
  return {
    ok: true,
    data,
    attachments,
    meta: {
      version,
      exportedAt: typeof obj.exportedAt === 'string' ? obj.exportedAt : null,
      profiles: count(K.PROFILES),
      expenses: count(K.EXPENSES),
      documents: count(K.DOCUMENTS),
      attachments: attachments.length,
    },
  };
}
