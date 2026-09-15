import { INITIAL_PROFILES, INITIAL_DOCUMENTS, INITIAL_EXPENSES } from './initialData';
import { exportAllAppData, importAllAppData } from './exportImportService';
import { profileFinanceStorage } from './profileFinanceStorage';

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
    return raw ? JSON.parse(raw) : INITIAL_PROFILES;
  },
  saveProfiles(profiles) {
    localStorage.setItem(KEYS.PROFILES, JSON.stringify(profiles));
  },
  getDocuments() {
    const raw = localStorage.getItem(KEYS.DOCUMENTS);
    return raw ? JSON.parse(raw) : INITIAL_DOCUMENTS;
  },
  saveDocuments(docs) {
    localStorage.setItem(KEYS.DOCUMENTS, JSON.stringify(docs));
  },
  getExpenses() {
    const raw = localStorage.getItem(KEYS.EXPENSES);
    return raw ? JSON.parse(raw) : INITIAL_EXPENSES;
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
  exportAllData() {
    return exportAllAppData(this);
  },
  importAllData(jsonString) {
    return importAllAppData(this, jsonString);
  },
};
