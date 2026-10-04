import { useCallback } from 'react';
import { usePersistentState } from '../../hooks/usePersistentState';
import { storageService } from '../../core/storage';
import { requestAddProfile } from '../../core/state/profileActions';
import { isDemoData } from './demoDataMatch';

// Banner state: visible only while the data is exactly the sample data and the user has not
// chosen to keep it. "Start fresh" wipes the data (after the confirm dialog) and opens "New profile".
export function useDemoData({ profiles, expenses, documents }, onDataReset) {
  const [choice, setChoice] = usePersistentState('demoChoice', null);
  // Not memoized: strategies and fund settings live outside these props.
  const isDemo = isDemoData({ profiles, expenses, documents });
  const visible = choice !== 'keep' && isDemo;

  const keepSamples = useCallback(() => setChoice('keep'), [setChoice]);

  const startFresh = useCallback(async () => {
    const res = storageService.clearAllData();
    setChoice('fresh');
    onDataReset?.();
    requestAddProfile();
    await res?.done; // receipts stored in IndexedDB
  }, [onDataReset, setChoice]);

  // Re-checked when the user confirms: data may have changed while the dialog was open.
  const isStillDemo = useCallback(() => isDemoData({
    profiles: storageService.getProfiles(),
    expenses: storageService.getExpenses(),
    documents: storageService.getDocuments(),
  }), []);

  return { visible, keepSamples, startFresh, isStillDemo };
}
