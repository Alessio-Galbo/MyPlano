import { DATA_KEYS } from './storageKeys';
import { readRaw, writeRaw } from './safeStorage';
import { normalizeAlertDays } from '../notifications/alertDays';
import { announceDataChange } from '../state/uiActions';

// Global default notice (days) for expenses without their own `alertDays` (Settings > general card).
// Data key: included in backup/export and removed by reset (back to 30). Every subscriber (bell,
// card, form) updates at once; the `storage` event keeps other tabs in sync.
const KEY = DATA_KEYS.EXPENSE_ALERT_DAYS;
const listeners = new Set();

export function getExpenseAlertDefault() {
  return normalizeAlertDays(readRaw(KEY));
}

export function setExpenseAlertDefault(days) {
  const res = writeRaw(KEY, String(normalizeAlertDays(days)));
  listeners.forEach((fn) => fn());
  return announceDataChange(res);
}

export function subscribeExpenseAlertDefault(listener) {
  listeners.add(listener);
  const onStorage = (e) => {
    if (e.key === KEY || e.key === null) listener();
  };
  window.addEventListener('storage', onStorage);
  return () => {
    listeners.delete(listener);
    window.removeEventListener('storage', onStorage);
  };
}
