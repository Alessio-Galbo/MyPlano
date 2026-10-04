import { useCallback, useEffect, useRef, useState } from 'react';

// A piece of state mirrored to storage. Callers update it with functional
// setters (two calls in the same tick both apply); the write happens in an
// effect after commit, never inside an updater (StrictMode runs updaters twice).
// `read`/`write` must be stable (module-level) functions.
export function usePersistedSlice(read, write) {
  const [value, setValue] = useState(read);
  const syncedRef = useRef(value);

  useEffect(() => {
    if (value === syncedRef.current) return;
    syncedRef.current = value;
    write(value);
  }, [value, write]);

  // Re-read from storage (import, other tab) without writing the value back.
  const reload = useCallback(() => {
    const next = read();
    syncedRef.current = next;
    setValue(next);
  }, [read]);

  return [value, setValue, reload];
}
