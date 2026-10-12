// Runs the periodic automatic backup check on app startup.
import { useEffect } from 'react';
import { runAutoBackupIfNeeded } from '../core/storage/autoBackup';

export function useAutoBackupLifecycle() {
  useEffect(() => {
    runAutoBackupIfNeeded().catch(() => {});
  }, []);
}
