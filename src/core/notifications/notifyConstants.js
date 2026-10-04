// Names shared by the page and the Service Worker code in public/sw-notify.js (keep them in sync).
import { UI_PREFIX } from '../storage/storageKeys';

export const NOTIFY_DB = 'myplano_notify';
export const NOTIFY_STORE = 'kv';
export const MIRROR_KEY = 'mirror';
export const LOG_KEY = 'log';
export const SYNC_TAG = 'myplano-deadlines';
export const MSG_CHECK = 'myplano-notify-check';
export const MSG_OPEN = 'myplano-open-notifications';
export const OPEN_PARAM = 'notifications';
export const SYNC_MIN_INTERVAL_MS = 12 * 60 * 60 * 1000;

// "Notifiche sul dispositivo" on/off: usePersistentState(PREF_NAME) in the settings card.
export const PREF_NAME = 'system_notifications';
export const PREF_KEY = UI_PREFIX + PREF_NAME;
export const PREF_EVENT = 'myplano:system-notifications-pref';
