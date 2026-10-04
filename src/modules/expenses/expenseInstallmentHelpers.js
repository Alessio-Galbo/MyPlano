import { todayISO } from '../../core/dates/isoDate';
import {
  getNextOccurrence, getOccurrences, getRecurrenceStep, stepDate,
} from '../../core/dates/recurrence';

// One step forward (kept for existing callers). Month steps clamp: 31 Jan -> 28/29 Feb.
export function advanceDate(dateStr, frequency, interval = 1, unit = 'months') {
  return stepDate(dateStr, getRecurrenceStep(frequency, interval, unit));
}

export function getInstallmentStatus(expense, dateStr) {
  if (expense.installments?.[dateStr]?.status) return expense.installments[dateStr].status;
  if (expense.status === 'paid' && expense.nextDueDate === dateStr) return 'paid';
  return 'due';
}

export function toggleInstallmentStatus(expense, dateStr) {
  const currentStatus = getInstallmentStatus(expense, dateStr);
  const nextStatus = currentStatus === 'paid' ? 'due' : 'paid';
  const existingInstallments = expense.installments || {};

  const updatedInstallments = {
    ...existingInstallments,
    [dateStr]: {
      ...existingInstallments[dateStr],
      status: nextStatus,
      paidAt: nextStatus === 'paid' ? todayISO() : null,
    },
  };

  return {
    ...expense,
    installments: updatedInstallments,
    status: dateStr === expense.nextDueDate ? nextStatus : expense.status,
  };
}

export function getExpenseDatesInYear(expense, targetYear) {
  const y = Number(targetYear);
  if (!Number.isFinite(y)) return [];
  return getOccurrences(expense, `${y}-01-01`, `${y}-12-31`, { backfill: 'installments' });
}

export function findNextInstallmentDate(expense, currentDueDateStr) {
  if (expense.frequency === 'oneOff' || !currentDueDateStr) return null;
  return getNextOccurrence(expense, currentDueDateStr);
}
