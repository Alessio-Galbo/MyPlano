import { getOccurrences, isISODate, isOccurrenceActive } from '../../core/dates/recurrence';

const yearOf = (iso) => Number(String(iso).slice(0, 4));

export function getAllExpenseInstallmentDates(expense) {
  if (!expense) return [];
  const instKeys = Object.keys(expense.installments || {}).filter(isISODate);
  const instYears = instKeys.map(yearOf);
  const baseYear = yearOf(expense.startDate || expense.nextDueDate || '2026-01-01') || 2026;
  const nextDueYear = yearOf(expense.nextDueDate || '2026-01-01') || 2026;
  const startYear = Math.min(baseYear, ...instYears, 2025);
  let endYear = Math.max(nextDueYear + 2, ...instYears, 2027);
  if (isISODate(expense.endDate)) endYear = Math.min(endYear, yearOf(expense.endDate));

  const allDates = new Set(getOccurrences(expense, `${startYear}-01-01`, `${endYear}-12-31`, { backfill: 'history' }));
  instKeys.forEach((d) => allDates.add(d));
  if (isISODate(expense.nextDueDate)) allDates.add(expense.nextDueDate);
  return [...allDates].filter((d) => isOccurrenceActive(expense, d)).sort().reverse();
}

export function getInstallmentDetails(expense, dateStr) {
  const inst = expense.installments?.[dateStr];
  const isPaid = inst?.status === 'paid' || (dateStr === expense.nextDueDate && expense.status === 'paid');
  const atts = inst?.attachments || (inst?.receipt ? [inst.receipt] : []);
  return {
    date: dateStr,
    amount: inst?.amount != null ? inst.amount : expense.amount,
    status: isPaid ? 'paid' : 'due',
    paidAt: inst?.paidAt || (isPaid ? dateStr : null),
    attachments: atts,
    note: inst?.note || '',
    isExtra: Boolean(inst?.isExtra),
  };
}
