import { addDays, diffDays, todayISO } from '../../../core/dates/isoDate';
import { getOccurrences, getNextOccurrence } from '../../../core/dates/recurrence';
import { getInstallmentStatus } from '../../expenses/expenseInstallmentHelpers';

// Unpaid expenses / expired documents stay listed as "overdue" for this many days.
export const OVERDUE_HORIZON_DAYS = 60;
export const EXPENSE_WINDOW_DAYS = 30;
export const DEFAULT_DOC_ALERT_DAYS = 30;

export const expenseNotifId = (expenseId, date) => `exp-${expenseId}@${date}`;
export const documentNotifId = (docId, date) => `doc-${docId}@${date}`;

export function getDocumentAlertDays(doc) {
  const n = Math.floor(Number(doc?.alertDays));
  return n > 0 ? n : DEFAULT_DOC_ALERT_DAYS;
}

// Next due date of an expense on or after today (any payment status), or null.
export function getNextExpenseDate(expense, today = todayISO()) {
  return getNextOccurrence(expense, addDays(today, -1));
}

function baseItem(today, date, raw, itemType, id, legacyId) {
  const days = diffDays(today, date);
  return {
    id, legacyId, itemType, date, raw,
    entityId: raw.id,
    title: raw.title,
    profileId: raw.profileId,
    diffDays: days,
    isOverdue: days < 0,
    alertEnabled: raw.enableAlert !== false,
  };
}

function expenseItems(e, today) {
  if (!e?.nextDueDate) return [];
  const horizon = addDays(today, -OVERDUE_HORIZON_DAYS);
  // Dates before nextDueDate are history: only from nextDueDate onward can be overdue.
  const from = horizon > e.nextDueDate ? horizon : e.nextDueDate;
  const dates = getOccurrences(e, from, addDays(today, EXPENSE_WINDOW_DAYS))
    .filter((d) => getInstallmentStatus(e, d) !== 'paid');
  const next = getNextExpenseDate(e, today);
  return dates.map((date) => ({
    ...baseItem(today, date, e, 'expense', expenseNotifId(e.id, date), `exp-${e.id}`),
    isNext: date === next,
    amount: e.installments?.[date]?.amount ?? e.amount,
    frequency: e.frequency,
    category: e.category,
  }));
}

function documentItem(d, today) {
  const date = typeof d?.expiryDate === 'string' ? d.expiryDate.slice(0, 10) : '';
  const days = diffDays(today, date);
  if (Number.isNaN(days) || days < -OVERDUE_HORIZON_DAYS) return null;
  const windowDays = d.enableAlert === false ? DEFAULT_DOC_ALERT_DAYS : getDocumentAlertDays(d);
  if (days > windowDays) return null;
  return {
    ...baseItem(today, date, d, 'document', documentNotifId(d.id, date), `doc-${d.id}`),
    isNext: true, // one occurrence per document: a legacy `doc-<id>` id applies to it
    docType: d.type,
    identifier: d.identifier,
    issuer: d.issuer,
  };
}

// Deadlines of the profile (or 'all'): overdue (last 60 days, unpaid/expired) and upcoming
// (expenses 30 days, documents `alertDays`). One item per occurrence, sorted by date.
export function getUpcomingDeadlines(expenses = [], documents = [], profileId = 'all', today = todayISO()) {
  const mine = (x) => profileId === 'all' || x?.profileId === profileId;
  const items = [
    ...(expenses || []).filter(mine).flatMap((e) => expenseItems(e, today)),
    ...(documents || []).filter(mine).map((d) => documentItem(d, today)).filter(Boolean),
  ];
  return items.sort((a, b) => (a.date === b.date
    ? String(a.title).localeCompare(String(b.title))
    : (a.date < b.date ? -1 : 1)));
}
