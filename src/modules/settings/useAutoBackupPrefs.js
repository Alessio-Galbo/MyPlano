// Hook to manage automatic backup user preferences.
import { useState } from 'react';
import { readAutoBackupPrefs, saveAutoBackupPrefs } from '../../core/storage/autoBackup';

export function useAutoBackupPrefs() {
  const [prefs, setPrefs] = useState(() => readAutoBackupPrefs());

  const toggleEnabled = (enabled) => {
    const updated = saveAutoBackupPrefs({ enabled });
    setPrefs(updated);
  };

  const changeFrequency = (frequency) => {
    const updated = saveAutoBackupPrefs({ frequency });
    setPrefs(updated);
  };

  const refreshPrefs = () => setPrefs(readAutoBackupPrefs());

  return { prefs, toggleEnabled, changeFrequency, refreshPrefs };
}
