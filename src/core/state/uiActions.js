import { useEffect } from 'react';

// Opens the in-app notification center from anywhere (e.g. a click on a system notification,
// src/core/notifications/swBridge.js). NavbarNotificationsBtn listens with useOpenNotificationCenterRequest.
// A request made before the navbar is mounted (app opened from a notification) waits for the listener.
const OPEN_NOTIFICATION_CENTER = 'myplano:open-notification-center';
let centerListeners = 0;
let pendingOpen = false;

export function requestOpenNotificationCenter() {
  if (centerListeners === 0) pendingOpen = true;
  else window.dispatchEvent(new CustomEvent(OPEN_NOTIFICATION_CENTER));
}

export function useOpenNotificationCenterRequest(handler) {
  useEffect(() => {
    centerListeners += 1;
    window.addEventListener(OPEN_NOTIFICATION_CENTER, handler);
    if (pendingOpen) {
      pendingOpen = false;
      handler();
    }
    return () => {
      centerListeners -= 1;
      window.removeEventListener(OPEN_NOTIFICATION_CENTER, handler);
    };
  }, [handler]);
}

// Fired after the app saved data the system notifications depend on (expenses, documents, global mute):
// src/core/notifications/notifyLifecycle.js rewrites the Service Worker mirror right away.
export const DATA_CHANGED_EVENT = 'myplano:data-changed';

export function announceDataChange(result) {
  if (typeof window !== 'undefined') window.dispatchEvent(new CustomEvent(DATA_CHANGED_EVENT));
  return result;
}
