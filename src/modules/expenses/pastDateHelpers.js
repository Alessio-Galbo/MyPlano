import { diffDays, parseISODate, toISODate, todayISO } from '../../core/dates/isoDate';
import { getGridDates, getRecurrenceStep } from '../../core/dates/recurrence';

export function isDateInPast(dateStr) {
  if (!dateStr) return false;
  const days = diffDays(todayISO(), String(dateStr).slice(0, 10));
  return !Number.isNaN(days) && days < 0;
}

// Kept for compatibility: adds months to a Date (or ISO string), clamping to the month's end.
export function advanceMonths(date, months) {
  const base = typeof date === 'string' ? parseISODate(date) : new Date(date);
  const total = base.getMonth() + months;
  const year = base.getFullYear() + Math.floor(total / 12);
  const month = ((total % 12) + 12) % 12;
  const day = Math.min(base.getDate(), new Date(year, month + 1, 0).getDate());
  return new Date(year, month, day);
}

// First date of the series (origin pastDateStr) that is today or later.
export function calculateNextFutureOccurrence(pastDateStr, frequency, customInterval = 1, customUnit = 'months') {
  if (!pastDateStr) return '';
  const origin = String(pastDateStr).slice(0, 10);
  const today = todayISO();
  if (origin >= today || frequency === 'oneOff') return pastDateStr;
  const step = getRecurrenceStep(frequency, customInterval, customUnit) || { unit: 'months', n: 12 };
  const end = toISODate(new Date(parseISODate(today).getFullYear() + 3, 0, 1));
  return getGridDates(origin, step, today, end)[0] || pastDateStr;
}
