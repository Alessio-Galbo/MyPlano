// Periodic Background Sync (Chrome/Edge, installed app only): the browser wakes the Service Worker about
// once or twice a day and public/sw-notify.js notifies with the app closed. Best effort, never required.
import { SYNC_TAG, SYNC_MIN_INTERVAL_MS } from './notifyConstants';
import { isInstalledApp } from './environment';

async function getRegistration() {
  if (!('serviceWorker' in navigator)) return null;
  return navigator.serviceWorker.getRegistration().catch(() => null);
}

export async function isPeriodicSyncSupported() {
  const reg = await getRegistration();
  return Boolean(reg && 'periodicSync' in reg);
}

async function syncPermission() {
  try {
    const status = await navigator.permissions.query({ name: 'periodic-background-sync' });
    return status.state;
  } catch {
    return 'unsupported';
  }
}

export async function isPeriodicSyncActive() {
  const reg = await getRegistration();
  if (!reg?.periodicSync) return false;
  const tags = await reg.periodicSync.getTags().catch(() => []);
  return tags.includes(SYNC_TAG);
}

// Registers only when supported, installed, notifications granted and the browser grants the sync.
export async function updatePeriodicSync(enabled) {
  const reg = await getRegistration();
  if (!reg?.periodicSync) return false;
  const wanted = enabled && isInstalledApp() && Notification.permission === 'granted'
    && (await syncPermission()) === 'granted';
  try {
    if (wanted) await reg.periodicSync.register(SYNC_TAG, { minInterval: SYNC_MIN_INTERVAL_MS });
    else await reg.periodicSync.unregister(SYNC_TAG);
  } catch {
    return false;
  }
  return isPeriodicSyncActive();
}
