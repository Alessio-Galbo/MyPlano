import { useCallback } from 'react';
import { usePersistentState } from '../../hooks/usePersistentState';
import { storageService } from '../../core/storage';
import { requestAddProfile } from '../../core/state/profileActions';
import { isDemoData, getDemoLeftovers, removeDemoLeftovers } from './demoDataMatch';

// Demo banner state. mode: 'full' (only sample data: offer to wipe everything), 'mixed' (untouched
// sample items next to the user's own data: offer to remove only those), or null.
// choice ('keep' | 'fresh') is remembered; 'fresh' also unlocks the notification step.
export function useDemoData({ profiles, expenses, documents }, onDataReset) {
  const [choice, setChoice] = usePersistentState('demoChoice', null);
  // Not memoized: strategies and fund settings live outside these props.
  const data = { profiles, expenses, documents };
  const isDemo = isDemoData(data);
  const leftovers = isDemo ? null : getDemoLeftovers(data);
  let mode = null;
  if (choice !== 'keep' && isDemo) mode = 'full';
  else if (choice !== 'keep' && leftovers?.total > 0) mode = 'mixed';

  const keepSamples = useCallback(() => setChoice('keep'), [setChoice]);

  const startFresh = useCallback(async () => {
    const res = storageService.clearAllData();
    setChoice('fresh');
    onDataReset?.();
    requestAddProfile();
    await res?.done; // receipts stored in IndexedDB
  }, [onDataReset, setChoice]);

  const removeSamples = useCallback(() => {
    removeDemoLeftovers();
    setChoice('fresh');
    onDataReset?.();
  }, [onDataReset, setChoice]);

  // Re-checked on the stored data when the user confirms (another tab may have changed it).
  const isStillDemo = useCallback(() => isDemoData({
    profiles: storageService.getProfiles(),
    expenses: storageService.getExpenses(),
    documents: storageService.getDocuments(),
  }), []);

  return { mode, leftovers, choice, keepSamples, startFresh, removeSamples, isStillDemo };
}
