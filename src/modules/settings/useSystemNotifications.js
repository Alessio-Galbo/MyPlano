import { useCallback, useEffect, useState } from 'react';
import { usePersistentState } from '../../hooks/usePersistentState';
import {
  PREF_NAME, PREF_EVENT, getPermission, isNotificationSupported, describeCapability,
  updatePeriodicSync, isPeriodicSyncSupported,
} from '../../core/notifications';

// State of the "Notifiche sul dispositivo" card: persisted choice, browser permission, background sync.
export function useSystemNotifications() {
  const [enabled, setEnabled] = usePersistentState(PREF_NAME, false);
  const [permission, setPermission] = useState(getPermission);
  const [periodic, setPeriodic] = useState({ periodicActive: false, periodicSupported: false });

  useEffect(() => {
    let alive = true;
    window.dispatchEvent(new Event(PREF_EVENT)); // mirror + check (usePersistentState already saved)
    Promise.all([updatePeriodicSync(enabled), isPeriodicSyncSupported()]).then(([active, supported]) => {
      if (alive) setPeriodic({ periodicActive: active, periodicSupported: supported });
    }).catch(() => {});
    return () => { alive = false; };
  }, [enabled, permission]);

  // The user may change the permission in the browser settings and come back.
  useEffect(() => {
    const onVisible = () => { if (document.visibilityState === 'visible') setPermission(getPermission()); };
    document.addEventListener('visibilitychange', onVisible);
    return () => document.removeEventListener('visibilitychange', onVisible);
  }, []);

  // Notification.requestPermission() only here, on the user's tap.
  const toggle = useCallback(async (next) => {
    if (!next) { setEnabled(false); return; }
    if (!isNotificationSupported()) return;
    let current = Notification.permission;
    if (current === 'default') current = await Notification.requestPermission();
    setPermission(current);
    if (current === 'granted') setEnabled(true);
  }, [setEnabled]);

  const supported = isNotificationSupported();
  const active = supported && enabled && permission === 'granted';
  let status = 'off';
  if (!supported) status = 'unsupported';
  else if (permission === 'denied') status = 'denied';
  else if (active) status = 'active';

  return { active, status, toggle, capability: describeCapability(periodic), canTest: supported && permission === 'granted' };
}
