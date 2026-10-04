// Writes the mirror (buildMirror.js) to IndexedDB when the data change (see notifyLifecycle.js); skipped when
// the raw localStorage values and the day are the same as at the last write.
import { DATA_KEYS, UI_KEYS } from '../storage/storageKeys';
import { readJSON } from '../storage/safeStorage';
import { getDismissedNotificationIds } from '../storage/notificationStorage';
import { todayISO } from '../dates/isoDate';
import { translations } from '../i18n/translations';
import { buildMirror } from './buildMirror';
import { setNotifyItem } from './notifyDb';
import { MIRROR_KEY, PREF_KEY } from './notifyConstants';

const WATCHED = [DATA_KEYS.EXPENSES, DATA_KEYS.DOCUMENTS, DATA_KEYS.DISMISSED_NOTIFICATIONS,
  DATA_KEYS.NOTIFICATIONS_MUTED, UI_KEYS.LANGUAGE, PREF_KEY];
let lastSignature = null;

const raw = (key) => {
  try { return localStorage.getItem(key); } catch { return null; }
};

export function currentLanguage() {
  const lang = raw(UI_KEYS.LANGUAGE);
  return lang === 'en' ? 'en' : 'it';
}

export function isSystemNotifyEnabled() {
  return raw(PREF_KEY) === 'true';
}

export function pushTexts(lang = currentLanguage()) {
  return translations[lang]?.common?.systemNotifications?.push || translations.it.common.systemNotifications.push;
}

// Returns true when the mirror was (re)written.
export async function syncMirror({ force = false } = {}) {
  if (typeof indexedDB === 'undefined') return false;
  const today = todayISO();
  const signature = [today, ...WATCHED.map(raw)].join('\u0000');
  if (!force && signature === lastSignature) return false;
  const lang = currentLanguage();
  const mirror = buildMirror({
    expenses: readJSON(DATA_KEYS.EXPENSES, [], Array.isArray),
    documents: readJSON(DATA_KEYS.DOCUMENTS, [], Array.isArray),
    dismissedIds: getDismissedNotificationIds(),
    enabled: isSystemNotifyEnabled(),
    muted: raw(DATA_KEYS.NOTIFICATIONS_MUTED) === 'true',
    lang,
    texts: pushTexts(lang),
    today,
  });
  try {
    await setNotifyItem(MIRROR_KEY, { ...mirror, updated: new Date().toISOString() });
    lastSignature = signature;
    return true;
  } catch {
    return false;
  }
}
