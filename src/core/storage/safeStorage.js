// Defensive localStorage access: corrupt JSON never crashes the app (the raw
// value is kept in a myplano_corrupt_* copy) and failed writes are reported
// with a window event instead of throwing.
export const STORAGE_ERROR_EVENT = 'myplano:storage-error';
export const CORRUPT_PREFIX = 'myplano_corrupt_';

function store() {
  try {
    return globalThis.localStorage ?? null;
  } catch {
    return null;
  }
}

export function readRaw(key) {
  try {
    return store()?.getItem(key) ?? null;
  } catch {
    return null;
  }
}

export function isQuotaError(error) {
  return error?.name === 'QuotaExceededError' || error?.name === 'NS_ERROR_DOM_QUOTA_REACHED'
    || error?.code === 22 || error?.code === 1014;
}

function notifyError(key, error) {
  const detail = { key, error, quota: isQuotaError(error) };
  try {
    globalThis.window?.dispatchEvent(new CustomEvent(STORAGE_ERROR_EVENT, { detail }));
  } catch {
    // no window (tests) or event not supported
  }
  console.error(`[MyPlano] storage write failed for ${key}`, error);
}

export function writeRaw(key, value) {
  try {
    const s = store();
    if (!s) throw new Error('localStorage unavailable');
    s.setItem(key, value);
    return { ok: true };
  } catch (error) {
    notifyError(key, error);
    return { ok: false, error };
  }
}

export function writeJSON(key, value) {
  let text;
  try {
    text = JSON.stringify(value);
  } catch (error) {
    notifyError(key, error);
    return { ok: false, error };
  }
  return writeRaw(key, text);
}

// Keeps one copy of each distinct corrupt value (no new copy on every startup).
function backupCorrupt(key, raw) {
  const s = store();
  if (!s) return;
  const prefix = `${CORRUPT_PREFIX}${key}_`;
  try {
    for (let i = 0; i < s.length; i += 1) {
      const k = s.key(i);
      if (k?.startsWith(prefix) && s.getItem(k) === raw) return;
    }
    s.setItem(`${prefix}${Date.now()}`, raw);
  } catch (error) {
    console.error(`[MyPlano] cannot back up corrupt ${key}`, error);
  }
}

// Returns fallback when the key is missing, unparsable or rejected by validate.
export function readJSON(key, fallback, validate) {
  const raw = readRaw(key);
  if (raw === null) return fallback;
  try {
    const value = JSON.parse(raw);
    if (validate && !validate(value)) throw new Error('unexpected shape');
    return value;
  } catch (error) {
    console.warn(`[MyPlano] corrupt data in ${key}, using fallback`, error);
    backupCorrupt(key, raw);
    return fallback;
  }
}

export const isPlainObject = (v) => v !== null && typeof v === 'object' && !Array.isArray(v);
