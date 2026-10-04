import { FREQUENCY_MULTIPLIERS } from '../../../core/types/constants';
import { addDays, addMonthsClamped, todayISO } from '../../../core/dates/isoDate';
import { getOccurrences } from '../../../core/dates/recurrence';
import { getExpenseEffectiveAmount } from '../../expenses/variableExpenseHelpers';
import { getUnpaidDueDates } from './recurrenceHelper';

function baseYearlyCount(expense) {
  if (expense.frequency === 'custom') {
    const interval = Math.max(1, Number(expense.customInterval) || 1);
    return expense.customUnit === 'days' ? 365 / interval : 12 / interval;
  }
  return FREQUENCY_MULTIPLIERS[expense.frequency] || 1;
}

// Share (0..1) of the installments of the next 12 months that are really scheduled,
// after "skip installment" (excludedDates) and "stop from this date" (endDate).
function activeShare(expense, today) {
  const hasLimits = expense.endDate || (expense.excludedDates || []).length > 0;
  if (!hasLimits) return 1;
  if (expense.endDate && expense.endDate < today) return 0;
  const to = addDays(addMonthsClamped(today, 12), -1);
  const plain = { ...expense, endDate: undefined, excludedDates: [] };
  const expected = getOccurrences(plain, today, to).length;
  if (expected === 0) return 1;
  return getOccurrences(expense, today, to).length / expected;
}

export function calculateItemAnnualCost(expense, today = todayISO()) {
  const effectiveAmount = getExpenseEffectiveAmount(expense);
  return effectiveAmount * baseYearlyCount(expense) * activeShare(expense, today);
}

export function calculateBudgetMetrics(expenses, profileId = 'all') {
  const filtered = profileId === 'all'
    ? expenses
    : expenses.filter((e) => e.profileId === profileId);

  const today = todayISO();
  const totalAnnual = filtered.reduce(
    (sum, item) => sum + calculateItemAnnualCost(item, today),
    0
  );

  const monthlyQuota = Math.ceil((totalAnnual / 12) * 100) / 100;

  // Today's due date included: ISO strings compared in local calendar days.
  const in30Days = addDays(today, 30);
  const upcoming30DaysCount = filtered
    .filter((item) => getUnpaidDueDates(item, today, in30Days).length > 0).length;

  return {
    filteredCount: filtered.length,
    totalAnnual: Math.round(totalAnnual * 100) / 100,
    monthlyQuota,
    upcoming30DaysCount,
  };
}
