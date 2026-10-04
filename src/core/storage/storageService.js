import { INITIAL_PROFILES, INITIAL_DOCUMENTS, INITIAL_EXPENSES } from './initialData';
import { exportAllAppData, importAllAppData } from './exportImportService';
import { profileFinanceStorage } from './profileFinanceStorage';
import { normalizeProfileFinances } from './profileMigrationHelper';
import { storageResetService } from './storageResetService';
import { ensureItemIds } from './idMigrationHelper';

const KEYS = {
  PROFILES: 'myplano_profiles',
  DOCUMENTS: 'myplano_documents',
  EXPENSES: 'myplano_expenses',
  MUTE: 'myplano_notifications_muted',
  INITIAL_BALANCE: 'myplano_initial_balance',
  MONTHLY_INCOME: 'myplano_monthly_income',
};

export const storageService = {
  getProfiles() {
    const raw = localStorage.getItem(KEYS.PROFILES);
    const parsed = raw !== null ? JSON.parse(raw) : INITIAL_PROFILES;
    return normalizeProfileFinances(parsed, this.getInitialBalance(), this.getMonthlyIncome());
  },
  saveProfiles(profiles) {
    localStorage.setItem(KEYS.PROFILES, JSON.stringify(profiles));
  },
  getDocuments() {
    const raw = localStorage.getItem(KEYS.DOCUMENTS);
    if (raw === null) return INITIAL_DOCUMENTS;
    const docs = JSON.parse(raw);
    const fixed = ensureItemIds(docs, 'doc');
    if (fixed !== docs) this.saveDocuments(fixed);
    return fixed;
  },
  saveDocuments(docs) {
    localStorage.setItem(KEYS.DOCUMENTS, JSON.stringify(docs));
  },
  getExpenses() {
    const raw = localStorage.getItem(KEYS.EXPENSES);
    if (raw === null) return INITIAL_EXPENSES;
    const expenses = JSON.parse(raw);
    const fixed = ensureItemIds(expenses, 'exp');
    if (fixed !== expenses) this.saveExpenses(fixed);
    return fixed;
  },
  saveExpenses(expenses) {
    localStorage.setItem(KEYS.EXPENSES, JSON.stringify(expenses));
  },
  getGlobalMute() {
    return localStorage.getItem(KEYS.MUTE) === 'true';
  },
  saveGlobalMute(muted) {
    localStorage.setItem(KEYS.MUTE, muted ? 'true' : 'false');
  },
  getInitialBalance() {
    const raw = localStorage.getItem(KEYS.INITIAL_BALANCE);
    return raw ? parseFloat(raw) : 0;
  },
  saveInitialBalance(val) {
    localStorage.setItem(KEYS.INITIAL_BALANCE, String(val || 0));
  },
  getMonthlyIncome() {
    const raw = localStorage.getItem(KEYS.MONTHLY_INCOME);
    return raw ? parseFloat(raw) : 0;
  },
  saveMonthlyIncome(val) {
    localStorage.setItem(KEYS.MONTHLY_INCOME, String(val || 0));
  },
  getProfileFunds: () => profileFinanceStorage.getProfileFunds(),
  saveProfileFunds: (f) => profileFinanceStorage.saveProfileFunds(f),
  getProfileFundConfigs: () => profileFinanceStorage.getProfileFundConfigs(),
  saveProfileFundConfigs: (c) => profileFinanceStorage.saveProfileFundConfigs(c),
  getProfileIncomes: () => profileFinanceStorage.getProfileIncomes(),
  saveProfileIncomes: (i) => profileFinanceStorage.saveProfileIncomes(i),
  getProfileIncomeConfigs: () => profileFinanceStorage.getProfileIncomeConfigs(),
  saveProfileIncomeConfigs: (c) => profileFinanceStorage.saveProfileIncomeConfigs(c),
  getProfileStrategies() {
    try {
      const raw = localStorage.getItem('myplano_budget_strategies');
      return raw ? JSON.parse(raw) : {};
    } catch { return {}; }
  },
  getProfileStrategy(profileId) {
    return this.getProfileStrategies()[profileId] || 'standard';
  },
  saveProfileStrategy(profileId, strategy) {
    try {
      const map = this.getProfileStrategies();
      map[profileId] = strategy;
      localStorage.setItem('myplano_budget_strategies', JSON.stringify(map));
    } catch { /* ignore */ }
  },
  exportAllData() { return exportAllAppData(this); },
  importAllData(json) { return importAllAppData(this, json); },
  clearAllData() { return storageResetService.clearAllData(this); },
  resetToFactoryDefaults() { return storageResetService.resetToFactoryDefaults(this); },
};
