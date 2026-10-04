// Due dates of an expense: series grid (see recurrenceGrid.js) + installments - excluded - after endDate.
import { addDays, addMonthsClamped } from './isoDate';
import {
  getExpenseOrigin, getExpenseStep, getGridDates, getSeriesFloor, isISODate, nthOccurrence,
} from './recurrenceGrid';

export {
  getExpenseOrigin, getExpenseStep, getGridDates, getRecurrenceStep, getSeriesFloor, isISODate, nthOccurrence,
} from './recurrenceGrid';

export function isOccurrenceActive(expense, iso) {
  if ((expense?.excludedDates || []).includes(iso)) return false;
  return !expense?.endDate || iso <= expense.endDate;
}

// All due dates of an expense in [fromIso, toIso] (inclusive, sorted, unique):
// series from the origin + dates stored in `installments`, minus excludedDates and after endDate.
// backfill (any truthy value, e.g. 'history') also rebuilds past dates before nextDueDate, back to
// the oldest installment key (views only; budget, cashflow and notifications keep the default false).
export function getOccurrences(expense, fromIso, toIso, { backfill = false } = {}) {
  if (!expense || !fromIso || !toIso || fromIso > toIso) return [];
  const origin = getExpenseOrigin(expense);
  const step = getExpenseStep(expense);
  const dates = new Set();
  if (origin && step) {
    const floor = backfill ? getSeriesFloor(expense) : origin;
    getGridDates(origin, step, fromIso, toIso, floor).forEach((d) => dates.add(d));
  } else if (origin) {
    const single = isISODate(expense.nextDueDate) ? expense.nextDueDate : origin;
    if (single >= fromIso && single <= toIso) dates.add(single);
  }
  Object.keys(expense.installments || {}).forEach((d) => {
    if (isISODate(d) && d >= fromIso && d <= toIso) dates.add(d);
  });
  return [...dates].filter((d) => isOccurrenceActive(expense, d)).sort();
}

// First active due date strictly after afterIso (looks ahead `years` years), or null.
export function getNextOccurrence(expense, afterIso, years = 5) {
  if (!isISODate(afterIso)) return null;
  const list = getOccurrences(expense, addDays(afterIso, 1), addMonthsClamped(afterIso, years * 12));
  return list[0] || null;
}

// One step forward from a date (no series context): month steps clamp to the month's end.
export function stepDate(iso, step) {
  if (!isISODate(iso) || !step) return iso;
  return nthOccurrence(iso, step, 1);
}
