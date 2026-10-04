// Detects (and, only on explicit request, fixes) installment keys saved one day early by the
// old timezone bug (e.g. '2027-01-14' for a monthly expense due on the 15th). Pure functions:
// nothing is changed until the caller passes the fixes the user confirmed.
import { addDays } from './isoDate';
import { getExpenseOrigin, getExpenseStep, getGridDates, getSeriesFloor, isISODate } from './recurrence';

function isOnSeries(expense, iso) {
  const origin = getExpenseOrigin(expense);
  if (!origin) return false;
  const step = getExpenseStep(expense);
  if (!step) return iso === (isISODate(expense.nextDueDate) ? expense.nextDueDate : origin);
  return getGridDates(origin, step, iso, iso, getSeriesFloor(expense)).length > 0;
}

// -> [{ expenseId, title, fromKey, toKey }]: off-series keys whose first series date within the
// next 1-3 days (old DST drift: 15 -> 14 -> 13) has no installment of its own. Extra payments
// (isExtra) and day-based steps (custom N days, where a 1-3 day move may be intended) are ignored.
export function findShiftedInstallmentKeys(expenses) {
  const out = [];
  (Array.isArray(expenses) ? expenses : []).forEach((exp) => {
    const inst = exp?.installments || {};
    if (getExpenseStep(exp)?.unit === 'days') return;
    const taken = new Set();
    Object.keys(inst).filter(isISODate).sort().forEach((fromKey) => {
      if (inst[fromKey]?.isExtra || isOnSeries(exp, fromKey)) return;
      const toKey = [1, 2, 3].map((n) => addDays(fromKey, n)).find((d) => isOnSeries(exp, d));
      if (!toKey || inst[toKey] || taken.has(toKey)) return;
      taken.add(toKey);
      out.push({ expenseId: exp.id, title: exp.title || '', fromKey, toKey });
    });
  });
  return out;
}

// Returns a NEW array with each confirmed fix applied: installments[fromKey] (status, paidAt,
// attachments, notes...) moves to toKey. Skipped when toKey already exists or fromKey is gone.
export function applyInstallmentKeyFixes(expenses, fixes) {
  if (!Array.isArray(expenses)) return [];
  const byId = new Map();
  (fixes || []).forEach((f) => {
    if (!f || !isISODate(f.fromKey) || !isISODate(f.toKey)) return;
    byId.set(f.expenseId, [...(byId.get(f.expenseId) || []), f]);
  });
  return expenses.map((exp) => {
    const list = byId.get(exp?.id);
    if (!list || !exp.installments) return exp;
    const inst = { ...exp.installments };
    let changed = false;
    list.forEach(({ fromKey, toKey }) => {
      if (!inst[fromKey] || inst[toKey]) return;
      inst[toKey] = inst[fromKey];
      delete inst[fromKey];
      changed = true;
    });
    return changed ? { ...exp, installments: inst } : exp;
  });
}
