import { useState, useEffect } from 'react';
import { UI_PREFIX } from '../core/storage/storageKeys';

// useState that survives reloads. Stored under `myplano_ui_<name>`.
// `validate(value)` may reject a stale value (e.g. a deleted profile): then the default is used.
export function usePersistentState(name, defaultValue, validate) {
  const key = UI_PREFIX + name;
  const [value, setValue] = useState(() => {
    try {
      const raw = localStorage.getItem(key);
      if (raw === null) return defaultValue;
      const parsed = JSON.parse(raw);
      return !validate || validate(parsed) ? parsed : defaultValue;
    } catch {
      return defaultValue;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // ignore: preferences are best effort
    }
  }, [key, value]);

  return [value, setValue];
}
