// Single registry of every localStorage key used by MyPlano.
// DATA keys: user data, included in backup/export and wiped by reset.
// UI keys: interface preferences (usePersistentState uses the UI_PREFIX).

export const DATA_KEYS = {
  PROFILES: 'myplano_profiles',
  DOCUMENTS: 'myplano_documents',
  EXPENSES: 'myplano_expenses',
  INITIAL_BALANCE: 'myplano_initial_balance',
  MONTHLY_INCOME: 'myplano_monthly_income',
  PROFILE_FUNDS: 'myplano_profile_funds',
  PROFILE_FUND_CONFIGS: 'myplano_profile_fund_configs',
  PROFILE_INCOMES: 'myplano_profile_incomes',
  PROFILE_INCOME_CONFIGS: 'myplano_profile_income_configs',
  BUDGET_STRATEGIES: 'myplano_budget_strategies',
  DISMISSED_NOTIFICATIONS: 'myplano_dismissed_notifications',
  NOTIFICATIONS_MUTED: 'myplano_notifications_muted',
  SCHEMA_VERSION: 'myplano_schema_version',
};

export const UI_KEYS = {
  LANGUAGE: 'myplano_language',
  DATABASE_HUB_PREFS: 'myplano_database_hub_prefs',
};

export const UI_PREFIX = 'myplano_ui_';

export const ALL_DATA_KEYS = Object.values(DATA_KEYS);

export function isMyPlanoKey(key) {
  return typeof key === 'string' && key.startsWith('myplano_');
}
