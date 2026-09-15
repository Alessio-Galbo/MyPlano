const KEYS = {
  PROFILE_FUNDS: 'myplano_profile_funds',
  PROFILE_FUND_CONFIGS: 'myplano_profile_fund_configs',
  PROFILE_INCOMES: 'myplano_profile_incomes',
  PROFILE_INCOME_CONFIGS: 'myplano_profile_income_configs',
};

export const profileFinanceStorage = {
  getProfileFunds() {
    const raw = localStorage.getItem(KEYS.PROFILE_FUNDS);
    return raw ? JSON.parse(raw) : {};
  },
  saveProfileFunds(funds) {
    localStorage.setItem(KEYS.PROFILE_FUNDS, JSON.stringify(funds || {}));
  },
  getProfileFundConfigs() {
    const raw = localStorage.getItem(KEYS.PROFILE_FUND_CONFIGS);
    return raw ? JSON.parse(raw) : {};
  },
  saveProfileFundConfigs(configs) {
    localStorage.setItem(KEYS.PROFILE_FUND_CONFIGS, JSON.stringify(configs || {}));
  },
  getProfileIncomes() {
    const raw = localStorage.getItem(KEYS.PROFILE_INCOMES);
    return raw ? JSON.parse(raw) : {};
  },
  saveProfileIncomes(incomes) {
    localStorage.setItem(KEYS.PROFILE_INCOMES, JSON.stringify(incomes || {}));
  },
  getProfileIncomeConfigs() {
    const raw = localStorage.getItem(KEYS.PROFILE_INCOME_CONFIGS);
    return raw ? JSON.parse(raw) : {};
  },
  saveProfileIncomeConfigs(configs) {
    localStorage.setItem(KEYS.PROFILE_INCOME_CONFIGS, JSON.stringify(configs || {}));
  },
};
