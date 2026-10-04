import { INITIAL_PROFILES, INITIAL_DOCUMENTS, INITIAL_EXPENSES } from './initialData';
import { DATA_KEYS as K, ALL_DATA_KEYS } from './storageKeys';
import { removeDbItemsByPrefix } from './indexedDbHelper';
import { runMigrations } from './migrations';
import { writeRaw } from './safeStorage';

// Both resets wipe every DATA key (storageKeys.ALL_DATA_KEYS) and the receipts stored
// in IndexedDB (`blob_*`). They keep interface preferences (language, `myplano_ui_*`),
// the `myplano_corrupt_*` safety copies and the connected PC archive folder: those are
// settings or recovery copies, and the files already in that folder belong to the user.
function wipeDataKeys() {
  ALL_DATA_KEYS.forEach((key) => localStorage.removeItem(key));
}

function clearStoredAttachments() {
  if (typeof indexedDB === 'undefined') return Promise.resolve(0);
  return removeDbItemsByPrefix('blob_').catch(() => 0);
}

function finish() {
  runMigrations({ fromVersion: 0 });
  return { success: true, done: clearStoredAttachments() };
}

export const storageResetService = {
  clearAllData() {
    wipeDataKeys();
    [K.PROFILES, K.EXPENSES, K.DOCUMENTS].forEach((key) => writeRaw(key, '[]'));
    writeRaw(K.INITIAL_BALANCE, '0');
    writeRaw(K.MONTHLY_INCOME, '0');
    return finish();
  },

  resetToFactoryDefaults() {
    wipeDataKeys();
    writeRaw(K.PROFILES, JSON.stringify(INITIAL_PROFILES));
    writeRaw(K.EXPENSES, JSON.stringify(INITIAL_EXPENSES));
    writeRaw(K.DOCUMENTS, JSON.stringify(INITIAL_DOCUMENTS));

    const funds = {};
    const incomes = {};
    INITIAL_PROFILES.forEach((p) => {
      funds[p.id] = p.initialBalance || 0;
      incomes[p.id] = p.monthlyIncome || 0;
    });
    const totFund = INITIAL_PROFILES.reduce((s, p) => s + (p.initialBalance || 0), 0);
    const totIncome = INITIAL_PROFILES.reduce((s, p) => s + (p.monthlyIncome || 0), 0);

    writeRaw(K.PROFILE_FUNDS, JSON.stringify(funds));
    writeRaw(K.PROFILE_INCOMES, JSON.stringify(incomes));
    writeRaw(K.INITIAL_BALANCE, String(totFund));
    writeRaw(K.MONTHLY_INCOME, String(totIncome));
    return finish();
  },
};
