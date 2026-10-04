import { DATA_KEYS as K, ALL_DATA_KEYS } from './storageKeys';
import { readAllDataKeys } from './backupFormat';
import { writeRaw } from './safeStorage';

// Keys missing from a backup are NOT kept from the current data: the import replaces
// everything. Lists become empty (never the sample data), other keys are removed so
// the app uses its defaults (0, {}, notifications on).
const EMPTY_LISTS = [K.PROFILES, K.DOCUMENTS, K.EXPENSES];
const NUMBER_KEYS = [K.INITIAL_BALANCE, K.MONTHLY_INCOME, K.SCHEMA_VERSION];

function serialize(key, value) {
  if (NUMBER_KEYS.includes(key)) return String(Number(value));
  if (key === K.NOTIFICATIONS_MUTED) return value === true || value === 'true' ? 'true' : 'false';
  return JSON.stringify(value);
}

function removeKey(key) {
  try { localStorage.removeItem(key); } catch { /* ignore */ }
}

// Puts the previous values back. All data keys are removed FIRST so the space taken
// by the half-written import is freed before rewriting. Returns false if a write failed.
export function restoreSnapshot(snapshot) {
  ALL_DATA_KEYS.forEach(removeKey);
  let ok = true;
  Object.entries(snapshot).forEach(([key, raw]) => {
    if (raw !== null && !writeRaw(key, raw).ok) ok = false;
  });
  return ok;
}

// Rolls back to `snapshot`; if even that fails the caller gets the snapshot so the
// user can download it (error 'restoreFailed').
export function rollback(snapshot, error) {
  return restoreSnapshot(snapshot)
    ? { success: false, error }
    : { success: false, error: 'restoreFailed', snapshot };
}

// All-or-nothing write of every data key; on failure the previous values are restored.
export function writeDataAtomically(data, snapshot = readAllDataKeys()) {
  try {
    ALL_DATA_KEYS.forEach((key) => {
      const value = data[key];
      let res = { ok: true };
      if (value !== undefined && value !== null) res = writeRaw(key, serialize(key, value));
      else if (EMPTY_LISTS.includes(key)) res = writeRaw(key, '[]');
      else removeKey(key);
      if (!res.ok) throw res.error;
    });
    return { success: true };
  } catch {
    return rollback(snapshot, 'writeFailed');
  }
}
