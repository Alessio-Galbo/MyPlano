import { addDays, todayISO } from '../../core/dates/isoDate';
import {
  OVERDUE_HORIZON_DAYS, getNextExpenseDate, expenseNotifId, documentNotifId,
} from '../../modules/budget/calculations/upcomingHelper';

// Old ids were per item (`exp-<id>`): they now hide only the item's NEXT occurrence,
// then pruneDismissedIds rewrites them as `exp-<id>@<date>`.
export function isItemDismissed(item, dismissedSet) {
  return dismissedSet.has(item.id) || (Boolean(item.isNext) && dismissedSet.has(item.legacyId));
}

function splitId(id) {
  const at = id.lastIndexOf('@');
  return at < 0 ? { base: id, date: null } : { base: id.slice(0, at), date: id.slice(at + 1) };
}

// Pure: returns the cleaned list (same array when nothing changes).
// - drops per-occurrence ids older than the overdue horizon (deleted items included, after it);
// - converts legacy ids: expenses -> next occurrence, documents -> current expiry (also if overdue).
export function pruneDismissedIds(ids, expenses = [], documents = [], today = todayISO()) {
  if (!ids.length || (!expenses.length && !documents.length)) return ids;
  const exp = new Map(expenses.filter((e) => e?.id).map((e) => [`exp-${e.id}`, e]));
  const docs = new Map(documents.filter((d) => d?.id).map((d) => [`doc-${d.id}`, d]));
  const oldest = addDays(today, -OVERDUE_HORIZON_DAYS);
  const out = [];
  ids.forEach((id) => {
    const { base, date } = splitId(id);
    // Per-occurrence ids live until their date leaves the overdue window, even when the
    // item is missing (deleted + "Undo" reinserts it with the same id).
    if (date) {
      if (date >= oldest) out.push(id);
      return;
    }
    const e = exp.get(base);
    const d = docs.get(base);
    if (!e && !d) {
      out.push(id); // legacy id of a missing item: kept (it may come back with Undo)
    } else if (e) {
      const next = getNextExpenseDate(e, today);
      if (next) out.push(expenseNotifId(e.id, next));
    } else {
      const expiry = String(d.expiryDate || '').slice(0, 10);
      if (expiry && expiry >= oldest) out.push(documentNotifId(d.id, expiry));
    }
  });
  const unique = [...new Set(out)];
  const same = unique.length === ids.length && unique.every((x, i) => x === ids[i]);
  return same ? ids : unique;
}
