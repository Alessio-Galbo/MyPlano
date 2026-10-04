import { getDismissedNotificationIds } from './notificationStorage';
import { DATA_KEYS } from './storageKeys';
import { writeJSON } from './safeStorage';

const BROKEN_NOTIF_IDS = ['exp-undefined', 'doc-undefined'];

export function createItemId(prefix) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

// Gives every item a unique id: missing ids are created, and when two items
// share an id the later one gets a new id (edit/delete would hit both otherwise).
// Returns the same array when nothing changed.
export function ensureItemIds(items, prefix) {
  if (!Array.isArray(items)) return items;
  const seen = new Set();
  let changed = false;
  let hadMissing = false;
  const out = items.map((it) => {
    if (it?.id && !seen.has(it.id)) {
      seen.add(it.id);
      return it;
    }
    if (!it?.id) hadMissing = true;
    changed = true;
    let id;
    do { id = createItemId(prefix); } while (seen.has(id));
    seen.add(id);
    return { ...it, id };
  });
  if (!changed) return items;
  if (hadMissing) dropBrokenDismissedIds();
  return out;
}

// "exp-undefined" / "doc-undefined" were shared by every id-less item:
// hiding one of them hid all of them.
function dropBrokenDismissedIds() {
  const current = getDismissedNotificationIds();
  const cleaned = current.filter((id) => !BROKEN_NOTIF_IDS.includes(id));
  if (cleaned.length !== current.length) writeJSON(DATA_KEYS.DISMISSED_NOTIFICATIONS, cleaned);
}
