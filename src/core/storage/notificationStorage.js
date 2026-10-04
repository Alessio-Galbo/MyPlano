import { DATA_KEYS } from './storageKeys';

// Shared store of dismissed notification ids (`exp-<id>@<date>` / `doc-<id>@<date>`).
// Every hook instance subscribes, so hiding an item in one view updates all the others at once;
// the `storage` event keeps other browser tabs in sync too.
const KEY = DATA_KEYS.DISMISSED_NOTIFICATIONS;
const EMPTY = Object.freeze([]);
const listeners = new Set();
let cacheRaw;
let cache = EMPTY;

function parse(raw) {
  if (!raw) return EMPTY;
  try {
    const list = JSON.parse(raw);
    return Array.isArray(list) ? list.filter((x) => typeof x === 'string') : EMPTY;
  } catch {
    return EMPTY;
  }
}

// Stable reference while the stored value does not change (required by useSyncExternalStore).
export function getDismissedNotificationIds() {
  let raw = null;
  try {
    raw = localStorage.getItem(KEY);
  } catch {
    return cache;
  }
  if (raw !== cacheRaw) {
    cacheRaw = raw;
    cache = parse(raw);
  }
  return cache;
}

function emit() {
  listeners.forEach((fn) => fn());
}

export function setDismissedNotificationIds(ids) {
  const unique = [...new Set(ids)];
  try {
    if (unique.length === 0) localStorage.removeItem(KEY);
    else localStorage.setItem(KEY, JSON.stringify(unique));
  } catch {
    // ignore: storage full or blocked
  }
  emit();
}

export function subscribeDismissedNotifications(listener) {
  listeners.add(listener);
  const onStorage = (e) => {
    if (e.key === KEY || e.key === null) listener();
  };
  window.addEventListener('storage', onStorage);
  return () => {
    listeners.delete(listener);
    window.removeEventListener('storage', onStorage);
  };
}

export function dismissNotificationId(id) {
  const current = getDismissedNotificationIds();
  if (!current.includes(id)) setDismissedNotificationIds([...current, id]);
}

export function restoreNotificationId(...ids) {
  const current = getDismissedNotificationIds();
  const next = current.filter((x) => !ids.includes(x));
  if (next.length !== current.length) setDismissedNotificationIds(next);
}

export function toggleNotificationId(id) {
  if (getDismissedNotificationIds().includes(id)) {
    restoreNotificationId(id);
    return false; // now active
  }
  dismissNotificationId(id);
  return true; // now hidden
}

export function restoreAllDismissedNotifications() {
  setDismissedNotificationIds([]);
}
