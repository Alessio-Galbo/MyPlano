// Series grid: recurring due dates computed from the ORIGIN (startDate || nextDueDate) as origin + k·step,
// never by iterative advancing (no drift, no month overflow, no timezone shift).
import { addDays, addMonthsClamped, diffDays, parseISODate } from './isoDate';

const MONTH_STEPS = { monthly: 1, bimonthly: 2, quarterly: 3, semiannual: 6, annual: 12, biennial: 24 };
const ISO_RE = /^\d{4}-\d{2}-\d{2}$/;
const MAX_STEPS = 5000;

export function isISODate(value) {
  return typeof value === 'string' && ISO_RE.test(value) && !!parseISODate(value);
}

// { unit: 'months' | 'days', n } or null for one-off / unknown frequencies.
export function getRecurrenceStep(frequency, customInterval, customUnit) {
  if (MONTH_STEPS[frequency]) return { unit: 'months', n: MONTH_STEPS[frequency] };
  if (frequency !== 'custom') return null;
  const n = Math.max(1, Math.floor(Number(customInterval)) || 1);
  return { unit: customUnit === 'days' ? 'days' : 'months', n };
}

export function getExpenseStep(expense) {
  return getRecurrenceStep(expense?.frequency, expense?.customInterval, expense?.customUnit);
}

export function getExpenseOrigin(expense) {
  const raw = expense?.startDate || expense?.nextDueDate;
  const iso = typeof raw === 'string' ? raw.slice(0, 10) : '';
  return isISODate(iso) ? iso : null;
}

// k-th date of the series (k may be negative). Month steps keep the origin's day, clamped.
export function nthOccurrence(origin, step, k) {
  if (step.unit === 'days') return addDays(origin, k * step.n);
  return addMonthsClamped(origin, k * step.n, parseISODate(origin).getDate());
}

function firstIndexNear(origin, step, fromIso) {
  if (step.unit === 'days') return Math.floor(diffDays(origin, fromIso) / step.n);
  const a = parseISODate(origin);
  const b = parseISODate(fromIso);
  const months = (b.getFullYear() - a.getFullYear()) * 12 + b.getMonth() - a.getMonth();
  return Math.floor(months / step.n) - 1;
}

// Grid dates inside [fromIso, toIso] and not before floorIso (default: the origin, i.e. k >= 0;
// an earlier floor extends the series backwards with negative k). Ignores endDate/excluded/installments.
export function getGridDates(origin, step, fromIso, toIso, floorIso = origin) {
  if (!origin || !step || !fromIso || !toIso) return [];
  const from = floorIso && floorIso > fromIso ? floorIso : fromIso;
  if (from > toIso) return [];
  const out = [];
  let k = firstIndexNear(origin, step, from);
  for (let i = 0; i < MAX_STEPS; i++, k++) {
    const d = nthOccurrence(origin, step, k);
    if (d > toIso) break;
    if (d >= from) out.push(d);
  }
  return out;
}

// How far back the series of an expense WITHOUT startDate may be rebuilt: the oldest installment
// key (never invent dates before the first real one), never more than 10 years back.
export function getSeriesFloor(expense) {
  const origin = getExpenseOrigin(expense);
  if (!origin || expense.startDate || !getExpenseStep(expense)) return origin;
  const keys = Object.keys(expense.installments || {}).filter(isISODate).sort();
  const wanted = keys[0] && keys[0] < origin ? keys[0] : origin;
  const limit = addMonthsClamped(origin, -120);
  return wanted < limit ? limit : wanted;
}
