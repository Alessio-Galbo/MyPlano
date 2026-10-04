// Started once by src/components/pwa/registerPwa.js: keeps the IndexedDB mirror up to date (on data saves and,
// as a safety net, whenever the app is hidden or shown) and, when the app is opened or comes back to the
// foreground, asks the Service Worker to show the summary notification.
import { syncMirror, isSystemNotifyEnabled } from './scheduleMirror';
import { requestNotifyCheck, listenOpenRequests } from './swBridge';
import { updatePeriodicSync } from './periodicSync';
import { PREF_EVENT } from './notifyConstants';
import { DATA_CHANGED_EVENT, requestOpenNotificationCenter } from '../state/uiActions';
import { subscribeDismissedNotifications } from '../storage/notificationStorage';

let started = false;

async function refresh({ check = false, force = false } = {}) {
  await syncMirror({ force });
  if (check && isSystemNotifyEnabled() && document.visibilityState === 'visible') await requestNotifyCheck();
}

export function startSystemNotifications() {
  if (started || typeof window === 'undefined') return;
  started = true;
  refresh({ check: true, force: true }).catch(() => {});
  updatePeriodicSync(isSystemNotifyEnabled()).catch(() => {});
  document.addEventListener('visibilitychange', () => {
    refresh({ check: document.visibilityState === 'visible' }).catch(() => {});
  });
  window.addEventListener('storage', () => { refresh().catch(() => {}); });
  window.addEventListener(PREF_EVENT, () => { refresh({ check: true, force: true }).catch(() => {}); });
  // Saves of expenses/documents (useAppData), global mute (navbar) and hidden notifications: mirror at once.
  window.addEventListener(DATA_CHANGED_EVENT, () => { refresh().catch(() => {}); });
  subscribeDismissedNotifications(() => { refresh().catch(() => {}); });
  listenOpenRequests(requestOpenNotificationCenter);
}
