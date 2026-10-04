// Pure: the "mirror" the Service Worker reads to notify with the app closed (public/sw-notify-core.js).
// Same selection as the navbar bell (getUpcomingDeadlines + hidden notifications + enableAlert), computed
// for today and for today+30 so it stays valid for about a month without opening the app
// (occurrences from 60 days ago to 60 days ahead). Texts are already translated.
import { addDays, todayISO } from '../dates/isoDate';
import {
  getUpcomingDeadlines, getDocumentAlertDays, EXPENSE_WINDOW_DAYS,
} from '../../modules/budget/calculations/upcomingHelper';
import { isItemDismissed } from '../../components/layout/notificationDismissal';

export const MIRROR_VERSION = 1;
export const MIRROR_AHEAD_DAYS = 30;

const soonDays = (item) => (item.itemType === 'document' ? getDocumentAlertDays(item.raw) : EXPENSE_WINDOW_DAYS);

export function buildMirror({
  expenses = [], documents = [], dismissedIds = [], enabled = false, muted = false,
  lang = 'it', texts = {}, today = todayISO(),
} = {}) {
  const hidden = new Set(dismissedIds);
  const byId = new Map();
  [today, addDays(today, MIRROR_AHEAD_DAYS)].forEach((day) => {
    getUpcomingDeadlines(expenses, documents, 'all', day).forEach((item) => {
      if (byId.has(item.id) || !item.alertEnabled || isItemDismissed(item, hidden)) return;
      byId.set(item.id, { id: item.id, date: item.date, title: String(item.title || ''), soon: soonDays(item) });
    });
  });
  const items = [...byId.values()].sort((a, b) => (a.date < b.date ? -1 : a.date > b.date ? 1 : 0));
  return { v: MIRROR_VERSION, enabled: Boolean(enabled), muted: Boolean(muted), lang, texts, items };
}
