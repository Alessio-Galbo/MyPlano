import { getExpenseDatesInYear } from './expenseInstallmentHelpers';

export function getAllExpenseInstallmentDates(expense) {
  if (!expense) return [];
  const instKeys = Object.keys(expense.installments || {});
  const instYears = instKeys.map((d) => new Date(d).getFullYear()).filter((y) => !isNaN(y));
  const baseYear = new Date(expense.startDate || expense.nextDueDate || '2026-01-01').getFullYear();
  const nextDueYear = new Date(expense.nextDueDate || '2026-01-01').getFullYear();

  const startYear = Math.min(baseYear, ...instYears, 2025);
  let endYear = Math.max(nextDueYear + 2, ...instYears, 2027);
  if (expense.endDate) {
    endYear = Math.min(endYear, new Date(expense.endDate).getFullYear());
  }

  const allDates = new Set(instKeys);
  if (expense.nextDueDate && !expense.excludedDates?.includes(expense.nextDueDate)) {
    allDates.add(expense.nextDueDate);
  }

  for (let y = startYear; y <= endYear; y++) {
    const datesInYear = getExpenseDatesInYear(expense, y);
    datesInYear.forEach((d) => allDates.add(d));
  }

  return Array.from(allDates)
    .filter((d) => !expense.excludedDates?.includes(d) && (!expense.endDate || d <= expense.endDate))
    .sort()
    .reverse();
}

export function getInstallmentDetails(expense, dateStr) {
  const inst = expense.installments?.[dateStr];
  const isPaid = inst?.status === 'paid' || (dateStr === expense.nextDueDate && expense.status === 'paid');
  return {
    date: dateStr,
    amount: inst?.amount != null ? inst.amount : expense.amount,
    status: isPaid ? 'paid' : 'due',
    paidAt: inst?.paidAt || (isPaid ? dateStr : null),
    receipt: inst?.receipt || null,
    note: inst?.note || '',
    isExtra: Boolean(inst?.isExtra),
  };
}
