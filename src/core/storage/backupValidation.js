import { DATA_KEYS as K } from './storageKeys';

const isPlainObject = (v) => !!v && typeof v === 'object' && !Array.isArray(v);
const hasId = (v) => (typeof v === 'string' && v !== '') || typeof v === 'number';
const isFiniteNumber = (v) => v !== '' && v !== null && Number.isFinite(Number(v));

const ITEM_LISTS = [K.DOCUMENTS, K.EXPENSES];
const OBJECT_MAPS = [
  K.PROFILE_FUNDS, K.PROFILE_FUND_CONFIGS, K.PROFILE_INCOMES, K.PROFILE_INCOME_CONFIGS, K.BUDGET_STRATEGIES,
];
const NUMBERS = [K.INITIAL_BALANCE, K.MONTHLY_INCOME, K.SCHEMA_VERSION];

function checkKey(key, value) {
  if (key === K.PROFILES) {
    return Array.isArray(value) && value.every((p) => isPlainObject(p) && hasId(p.id));
  }
  // Items without id (saved before the id fix) are accepted: ensureItemIds assigns one on load.
  if (ITEM_LISTS.includes(key)) return Array.isArray(value) && value.every(isPlainObject);
  if (key === K.DISMISSED_NOTIFICATIONS) return Array.isArray(value) && value.every((id) => typeof id === 'string');
  if (OBJECT_MAPS.includes(key)) return isPlainObject(value);
  if (NUMBERS.includes(key)) return isFiniteNumber(value);
  if (key === K.NOTIFICATIONS_MUTED) return typeof value === 'boolean' || value === 'true' || value === 'false';
  return true; // unknown keys are ignored on import
}

// Returns null when valid, otherwise an error code.
export function validateBackupData(data) {
  if (!Array.isArray(data[K.PROFILES])) return 'missingProfiles';
  const bad = Object.keys(data).find((key) => !checkKey(key, data[key]));
  return bad ? 'invalidData' : null;
}

export function validateAttachments(list) {
  return Array.isArray(list) && list.every((a) => isPlainObject(a)
    && typeof a.key === 'string' && a.key.startsWith('blob_') && typeof a.data === 'string');
}
