// Pure: notice window (days before a due date) of expenses. Each expense may set its own `alertDays`;
// expenses without it use the global default chosen in Settings (expenseAlertDefault.js), 30 if never set.
// Used by the bell, the "upcoming deadlines" card and the Service Worker mirror; the .ics alarm uses only
// the expense's own value (else 3 days, icsCalendar.js).
export const DEFAULT_EXPENSE_ALERT_DAYS = 30;
export const MAX_ALERT_DAYS = 365;

// Whole number between 1 and MAX_ALERT_DAYS, otherwise `fallback`.
export function normalizeAlertDays(value, fallback = DEFAULT_EXPENSE_ALERT_DAYS) {
  const n = Math.floor(Number(value));
  return Number.isFinite(n) && n >= 1 ? Math.min(n, MAX_ALERT_DAYS) : fallback;
}

export function getExpenseAlertDays(expense, defaultDays = DEFAULT_EXPENSE_ALERT_DAYS) {
  return normalizeAlertDays(expense?.alertDays, normalizeAlertDays(defaultDays));
}
