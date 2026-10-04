import { useEffect, useRef } from 'react';
import { isMyPlanoKey, UI_PREFIX } from '../storage/storageKeys';
import { CORRUPT_PREFIX } from '../storage/safeStorage';

const isDataKey = (key) => isMyPlanoKey(key) && !key.startsWith(UI_PREFIX) && !key.startsWith(CORRUPT_PREFIX);

// Another tab changed MyPlano data: reload so this tab does not overwrite it
// with its stale copy on the next save. key === null means storage.clear().
export function useStorageSync(onExternalChange) {
  const callbackRef = useRef(onExternalChange);
  useEffect(() => {
    callbackRef.current = onExternalChange;
  });

  useEffect(() => {
    const handler = (event) => {
      if (event.storageArea && event.storageArea !== window.localStorage) return;
      if (event.key !== null && !isDataKey(event.key)) return;
      callbackRef.current();
    };
    window.addEventListener('storage', handler);
    return () => window.removeEventListener('storage', handler);
  }, []);
}
