import { daysInMonth, toISODate } from '../../../core/dates/isoDate';
import { getOccurrences } from '../../../core/dates/recurrence';
import { getInstallmentStatus } from '../../expenses/expenseInstallmentHelpers';

function monthBounds(targetYear, targetMonthIndex) {
  const first = toISODate(new Date(targetYear, targetMonthIndex, 1));
  const last = toISODate(new Date(targetYear, targetMonthIndex, daysInMonth(targetYear, targetMonthIndex)));
  return [first, last];
}

// Unpaid due dates of an expense in [fromIso, toIso]
// (respects endDate, excludedDates, custom days/months, extra installments).
export function getUnpaidDueDates(item, fromIso, toIso) {
  if (!item?.nextDueDate) return [];
  return getOccurrences(item, fromIso, toIso).filter((d) => getInstallmentStatus(item, d) !== 'paid');
}

// How many unpaid installments of the expense fall in the month (0, 1, or more for short day intervals).
export function getDueDatesInMonth(item, targetYear, targetMonthIndex) {
  const [first, last] = monthBounds(targetYear, targetMonthIndex);
  return getUnpaidDueDates(item, first, last);
}

export function countDueInMonth(item, targetYear, targetMonthIndex) {
  return getDueDatesInMonth(item, targetYear, targetMonthIndex).length;
}

export function isExpenseDueInMonth(item, targetYear, targetMonthIndex) {
  return countDueInMonth(item, targetYear, targetMonthIndex) > 0;
}
