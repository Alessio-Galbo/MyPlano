import { INITIAL_PROFILES, INITIAL_DOCUMENTS, INITIAL_EXPENSES } from './initialData';
import { exportAllAppData, importAllAppData } from './exportImportService';
import { profileFinanceStorage } from './profileFinanceStorage';
import { normalizeProfileFinances } from './profileMigrationHelper';
import { storageResetService } from './storageResetService';
import { DATA_KEYS } from './storageKeys';
import { isPlainObject, readJSON, readRaw, writeJSON, writeRaw } from './safeStorage';

// Missing key → demo/default data; corrupt key → empty list (the raw value is
// backed up by readJSON, never replaced with demo data).
function readList(key, initial) {
  if (readRaw(key) === null) return initial;
  return readJSON(key, [], Array.isArray);
}

function readNumber(key) {
  const n = parseFloat(readRaw(key));
  return Number.isFinite(n) ? n : 0;
}

export const storageService = {
  getProfiles() {
    const list = readList(DATA_KEYS.PROFILES, INITIAL_PROFILES);
    return normalizeProfileFinances(list, this.getInitialBalance(), this.getMonthlyIncome());
  },
  saveProfiles: (profiles) => writeJSON(DATA_KEYS.PROFILES, profiles),
  getDocuments: () => readList(DATA_KEYS.DOCUMENTS, INITIAL_DOCUMENTS),
  saveDocuments: (docs) => writeJSON(DATA_KEYS.DOCUMENTS, docs),
  getExpenses: () => readList(DATA_KEYS.EXPENSES, INITIAL_EXPENSES),
  saveExpenses: (expenses) => writeJSON(DATA_KEYS.EXPENSES, expenses),
  getGlobalMute: () => readRaw(DATA_KEYS.NOTIFICATIONS_MUTED) === 'true',
  saveGlobalMute: (muted) => writeRaw(DATA_KEYS.NOTIFICATIONS_MUTED, muted ? 'true' : 'false'),
  getInitialBalance: () => readNumber(DATA_KEYS.INITIAL_BALANCE),
  saveInitialBalance: (val) => writeRaw(DATA_KEYS.INITIAL_BALANCE, String(val || 0)),
  getMonthlyIncome: () => readNumber(DATA_KEYS.MONTHLY_INCOME),
  saveMonthlyIncome: (val) => writeRaw(DATA_KEYS.MONTHLY_INCOME, String(val || 0)),
  getProfileFunds: () => profileFinanceStorage.getProfileFunds(),
  saveProfileFunds: (f) => profileFinanceStorage.saveProfileFunds(f),
  getProfileFundConfigs: () => profileFinanceStorage.getProfileFundConfigs(),
  saveProfileFundConfigs: (c) => profileFinanceStorage.saveProfileFundConfigs(c),
  getProfileIncomes: () => profileFinanceStorage.getProfileIncomes(),
  saveProfileIncomes: (i) => profileFinanceStorage.saveProfileIncomes(i),
  getProfileIncomeConfigs: () => profileFinanceStorage.getProfileIncomeConfigs(),
  saveProfileIncomeConfigs: (c) => profileFinanceStorage.saveProfileIncomeConfigs(c),
  getProfileStrategies: () => readJSON(DATA_KEYS.BUDGET_STRATEGIES, {}, isPlainObject),
  getProfileStrategy(profileId) {
    return this.getProfileStrategies()[profileId] || 'standard';
  },
  saveProfileStrategy(profileId, strategy) {
    const map = { ...this.getProfileStrategies(), [profileId]: strategy };
    return writeJSON(DATA_KEYS.BUDGET_STRATEGIES, map);
  },
  exportAllData() { return exportAllAppData(this); },
  importAllData(json) { return importAllAppData(this, json); },
  clearAllData() { return storageResetService.clearAllData(this); },
  resetToFactoryDefaults() { return storageResetService.resetToFactoryDefaults(this); },
};
