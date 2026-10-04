import { useEffect, useState } from 'react';
import { MAX_VISIBLE } from './toastQueue';

// Phones show at most 2 toasts at once (they sit over the top of the screen); the rest wait in the queue.
const PHONE_QUERY = '(max-width: 640px)';
const PHONE_MAX = 2;

const limitFor = (mql) => (mql?.matches ? PHONE_MAX : MAX_VISIBLE);

export function useToastLimit() {
  const [limit, setLimit] = useState(() => limitFor(window.matchMedia?.(PHONE_QUERY)));
  useEffect(() => {
    const mql = window.matchMedia?.(PHONE_QUERY);
    if (!mql) return undefined;
    const onChange = () => setLimit(limitFor(mql));
    mql.addEventListener('change', onChange);
    return () => mql.removeEventListener('change', onChange);
  }, []);
  return limit;
}
