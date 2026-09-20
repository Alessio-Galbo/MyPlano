const DISMISSED_NOTIFS_KEY = 'myplano_dismissed_notifications';

export function getDismissedNotificationIds() {
  try {
    const raw = localStorage.getItem(DISMISSED_NOTIFS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function dismissNotificationId(id) {
  try {
    const current = getDismissedNotificationIds();
    if (!current.includes(id)) {
      const updated = [...current, id];
      localStorage.setItem(DISMISSED_NOTIFS_KEY, JSON.stringify(updated));
    }
  } catch {
    // ignore
  }
}

export function restoreAllDismissedNotifications() {
  try {
    localStorage.removeItem(DISMISSED_NOTIFS_KEY);
  } catch {
    // ignore
  }
}
