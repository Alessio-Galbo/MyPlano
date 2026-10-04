import { diffDays, todayISO } from '../../core/dates/isoDate';
import { getRecurrenceStep, stepDate } from '../../core/dates/recurrence';

// Locale-aware (follows the UI language): see core/i18n/formatters.js
export { formatCurrency } from '../../core/i18n/formatters';

export function advanceNextDueDate(currentDateStr, frequency, customInterval = 1, customUnit = 'months') {
  const base = currentDateStr ? String(currentDateStr).slice(0, 10) : todayISO();
  const interval = frequency === 'custom' && customUnit === 'days' ? (Number(customInterval) || 30) : customInterval;
  return stepDate(base, getRecurrenceStep(frequency, interval, customUnit));
}

export function getExpenseUrgency(dueDateStr) {
  if (!dueDateStr) return { variant: 'neutral', label: 'due' };
  const days = diffDays(todayISO(), String(dueDateStr).slice(0, 10));
  if (Number.isNaN(days)) return { variant: 'neutral', label: 'due' };
  if (days < 0) return { variant: 'danger', label: 'overdue' };
  if (days <= 15) return { variant: 'warning', label: 'upcoming' };
  return { variant: 'neutral', label: 'due' };
}

export function getCategoryLabel(category, t) {
  if (!category) return '';
  const key = `expenses.categories.${category}`;
  const translated = t(key);
  return translated !== key ? translated : category;
}

export function getExpenseBadgeInfo(isPaid, isFromFund, urgency, t) {
  if (isPaid) {
    return {
      variant: 'success',
      label: isFromFund ? t('expenses.installments.paidFromFund') : t('expenses.installments.paid'),
    };
  }
  return {
    variant: urgency.variant,
    label: t(`expenses.status.${urgency.label}`),
  };
}
