import { getDismissedNotificationIds } from './notificationStorage';

const DISMISSED_NOTIFS_KEY = 'myplano_dismissed_notifications';
const BROKEN_NOTIF_IDS = ['exp-undefined', 'doc-undefined'];

export function createItemId(prefix) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

// Items saved before the id fix have no id: assign one so edit, delete and
// notifications can tell them apart. Returns the same array when nothing changed.
export function ensureItemIds(items, prefix) {
  if (!Array.isArray(items) || items.every((it) => it?.id)) return items;
  dropBrokenDismissedIds();
  return items.map((it) => (it?.id ? it : { ...it, id: createItemId(prefix) }));
}

// "exp-undefined" / "doc-undefined" were shared by every id-less item:
// hiding one of them hid all of them.
function dropBrokenDismissedIds() {
  try {
    const current = getDismissedNotificationIds();
    const cleaned = current.filter((id) => !BROKEN_NOTIF_IDS.includes(id));
    if (cleaned.length !== current.length) {
      localStorage.setItem(DISMISSED_NOTIFS_KEY, JSON.stringify(cleaned));
    }
  } catch {
    // ignore
  }
}
