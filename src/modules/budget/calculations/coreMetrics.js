import { FREQUENCY_MULTIPLIERS } from '../../../core/types/constants';
import { getExpenseEffectiveAmount } from '../../expenses/variableExpenseHelpers';

export function calculateItemAnnualCost(expense) {
  const effectiveAmount = getExpenseEffectiveAmount(expense);
  if (expense.frequency === 'custom') {
    const interval = Math.max(1, Number(expense.customInterval) || 1);
    if (expense.customUnit === 'days') {
      return effectiveAmount * (365 / interval);
    }
    return effectiveAmount * (12 / interval);
  }
  const mult = FREQUENCY_MULTIPLIERS[expense.frequency] || 1;
  return effectiveAmount * mult;
}

export function calculateBudgetMetrics(expenses, profileId = 'all') {
  const filtered = profileId === 'all'
    ? expenses
    : expenses.filter((e) => e.profileId === profileId);

  const totalAnnual = filtered.reduce(
    (sum, item) => sum + calculateItemAnnualCost(item),
    0
  );

  const monthlyQuota = Math.ceil((totalAnnual / 12) * 100) / 100;

  const now = new Date();
  const thirtyDaysLater = new Date();
  thirtyDaysLater.setDate(now.getDate() + 30);

  const upcoming30DaysCount = filtered.filter((item) => {
    if (!item.nextDueDate) return false;
    const due = new Date(item.nextDueDate);
    return due >= now && due <= thirtyDaysLater;
  }).length;

  return {
    filteredCount: filtered.length,
    totalAnnual: Math.round(totalAnnual * 100) / 100,
    monthlyQuota,
    upcoming30DaysCount,
  };
}
