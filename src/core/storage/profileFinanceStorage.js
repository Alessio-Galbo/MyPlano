import { DATA_KEYS } from './storageKeys';
import { isPlainObject, readJSON, writeJSON } from './safeStorage';

const read = (key) => readJSON(key, {}, isPlainObject);
const write = (key, value) => writeJSON(key, value || {});

export const profileFinanceStorage = {
  getProfileFunds: () => read(DATA_KEYS.PROFILE_FUNDS),
  saveProfileFunds: (funds) => write(DATA_KEYS.PROFILE_FUNDS, funds),
  getProfileFundConfigs: () => read(DATA_KEYS.PROFILE_FUND_CONFIGS),
  saveProfileFundConfigs: (configs) => write(DATA_KEYS.PROFILE_FUND_CONFIGS, configs),
  getProfileIncomes: () => read(DATA_KEYS.PROFILE_INCOMES),
  saveProfileIncomes: (incomes) => write(DATA_KEYS.PROFILE_INCOMES, incomes),
  getProfileIncomeConfigs: () => read(DATA_KEYS.PROFILE_INCOME_CONFIGS),
  saveProfileIncomeConfigs: (configs) => write(DATA_KEYS.PROFILE_INCOME_CONFIGS, configs),
};
