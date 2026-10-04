import { DATA_KEYS } from './storageKeys';
import { readJSON, readRaw, writeJSON, writeRaw } from './safeStorage';
import { ensureItemIds } from './idMigrationHelper';
import { normalizeProfileFinances } from './profileMigrationHelper';

// Technical, idempotent upgrades of the stored data (ids, formats; never user content).
// Each step brings the data to schema version `to`.
const num = (key) => parseFloat(readRaw(key)) || 0;

function persistNormalizedProfiles(storage) {
  const profiles = storage.readJSON(DATA_KEYS.PROFILES, null, Array.isArray);
  if (!profiles) return;
  const fixed = normalizeProfileFinances(profiles, num(DATA_KEYS.INITIAL_BALANCE), num(DATA_KEYS.MONTHLY_INCOME));
  if (JSON.stringify(fixed) !== JSON.stringify(profiles)) storage.writeJSON(DATA_KEYS.PROFILES, fixed);
}

function assignUniqueIds(storage) {
  [[DATA_KEYS.EXPENSES, 'exp'], [DATA_KEYS.DOCUMENTS, 'doc']].forEach(([key, prefix]) => {
    const list = storage.readJSON(key, null, Array.isArray);
    if (!list) return;
    const fixed = ensureItemIds(list, prefix);
    if (fixed !== list) storage.writeJSON(key, fixed);
  });
}

export const MIGRATIONS = [
  { to: 1, run: persistNormalizedProfiles },
  { to: 2, run: assignUniqueIds },
];

export const CURRENT_SCHEMA_VERSION = MIGRATIONS[MIGRATIONS.length - 1].to;

export function getSchemaVersion() {
  const n = parseInt(readRaw(DATA_KEYS.SCHEMA_VERSION), 10);
  return Number.isFinite(n) ? n : 0;
}

// Runs the pending steps once and stores the new version. After an import call
// runMigrations({ fromVersion: 0 }) to re-apply every (idempotent) step.
export function runMigrations({ fromVersion } = {}) {
  const from = fromVersion ?? getSchemaVersion();
  const storage = { readJSON, writeJSON, readRaw, writeRaw };
  const applied = [];
  for (const step of MIGRATIONS) {
    if (step.to <= from) continue;
    try {
      step.run(storage);
      applied.push(step.to);
    } catch (error) {
      console.error(`[MyPlano] migration to v${step.to} failed`, error);
      if (applied.length) writeRaw(DATA_KEYS.SCHEMA_VERSION, String(applied.at(-1)));
      return { from, to: applied.at(-1) ?? from, applied, error };
    }
  }
  if (from < CURRENT_SCHEMA_VERSION || getSchemaVersion() < CURRENT_SCHEMA_VERSION) {
    writeRaw(DATA_KEYS.SCHEMA_VERSION, String(CURRENT_SCHEMA_VERSION));
  }
  return { from, to: CURRENT_SCHEMA_VERSION, applied };
}
