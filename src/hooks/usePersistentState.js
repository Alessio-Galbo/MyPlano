import { useState, useEffect, useRef } from 'react';
import { UI_PREFIX } from '../core/storage/storageKeys';

function decode(raw, defaultValue, validate) {
  if (raw === null) return defaultValue;
  try {
    const parsed = JSON.parse(raw);
    return !validate || validate(parsed) ? parsed : defaultValue;
  } catch {
    return defaultValue;
  }
}

function readKey(key) {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

// useState that survives reloads. Stored under `myplano_ui_<name>`.
// `validate(value)` may reject a stale value (e.g. a deleted profile): then the default is used.
// Other tabs of the app stay in sync through the `storage` event (only fired in the *other* tabs).
export function usePersistentState(name, defaultValue, validate) {
  const key = UI_PREFIX + name;
  const [value, setValue] = useState(() => decode(readKey(key), defaultValue, validate));
  const latest = useRef({ defaultValue, validate });

  useEffect(() => {
    latest.current = { defaultValue, validate };
  });

  useEffect(() => {
    try {
      const raw = JSON.stringify(value);
      // Skip identical writes: a value just received from another tab is not echoed back.
      if (localStorage.getItem(key) !== raw) localStorage.setItem(key, raw);
    } catch {
      // ignore: preferences are best effort
    }
  }, [key, value]);

  useEffect(() => {
    const onStorage = (e) => {
      if (e.key !== key && e.key !== null) return;
      const { defaultValue: fallback, validate: check } = latest.current;
      const next = decode(e.key === null ? null : e.newValue, fallback, check);
      setValue((prev) => (JSON.stringify(prev) === JSON.stringify(next) ? prev : next));
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, [key]);

  return [value, setValue];
}
