import { INITIAL_PROFILES, INITIAL_DOCUMENTS, INITIAL_EXPENSES } from './initialData';

const ALL_STORAGE_KEYS = [
  'myplano_profiles',
  'myplano_documents',
  'myplano_expenses',
  'myplano_notifications_muted',
  'myplano_initial_balance',
  'myplano_monthly_income',
  'myplano_profile_funds',
  'myplano_profile_fund_configs',
  'myplano_profile_incomes',
  'myplano_profile_income_configs',
  'myplano_budget_strategies',
];

export const storageResetService = {
  clearAllData(storage) {
    ALL_STORAGE_KEYS.forEach((key) => localStorage.removeItem(key));
    localStorage.setItem('myplano_profiles', JSON.stringify([]));
    localStorage.setItem('myplano_expenses', JSON.stringify([]));
    localStorage.setItem('myplano_documents', JSON.stringify([]));
    localStorage.setItem('myplano_initial_balance', '0');
    localStorage.setItem('myplano_monthly_income', '0');
    localStorage.setItem('myplano_profile_funds', JSON.stringify({}));
    localStorage.setItem('myplano_profile_fund_configs', JSON.stringify({}));
    localStorage.setItem('myplano_profile_incomes', JSON.stringify({}));
    localStorage.setItem('myplano_profile_income_configs', JSON.stringify({}));
    localStorage.setItem('myplano_budget_strategies', JSON.stringify({}));
    return { success: true };
  },

  resetToFactoryDefaults(storage) {
    ALL_STORAGE_KEYS.forEach((key) => localStorage.removeItem(key));
    localStorage.setItem('myplano_profiles', JSON.stringify(INITIAL_PROFILES));
    localStorage.setItem('myplano_expenses', JSON.stringify(INITIAL_EXPENSES));
    localStorage.setItem('myplano_documents', JSON.stringify(INITIAL_DOCUMENTS));

    const funds = {};
    const incomes = {};
    INITIAL_PROFILES.forEach((p) => {
      funds[p.id] = p.initialBalance || 0;
      incomes[p.id] = p.monthlyIncome || 0;
    });

    const totFund = INITIAL_PROFILES.reduce((s, p) => s + (p.initialBalance || 0), 0);
    const totIncome = INITIAL_PROFILES.reduce((s, p) => s + (p.monthlyIncome || 0), 0);

    localStorage.setItem('myplano_profile_funds', JSON.stringify(funds));
    localStorage.setItem('myplano_profile_fund_configs', JSON.stringify({}));
    localStorage.setItem('myplano_profile_incomes', JSON.stringify(incomes));
    localStorage.setItem('myplano_profile_income_configs', JSON.stringify({}));
    localStorage.setItem('myplano_budget_strategies', JSON.stringify({}));
    localStorage.setItem('myplano_initial_balance', String(totFund));
    localStorage.setItem('myplano_monthly_income', String(totIncome));
    return { success: true };
  },
};
