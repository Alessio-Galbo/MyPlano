// State and actions for automatic backup settings and snapshot management.
import { useState, useEffect, useCallback } from 'react';
import {
  listSnapshots,
  createSnapshot,
  restoreSnapshot,
  deleteSnapshot,
  snapshotMeta,
} from '../../core/storage/autoBackup';
import { useAutoBackupPrefs } from './useAutoBackupPrefs';
import { downloadFile } from './icsExportHelper';

export function useAutoBackupActions(onDataRestored) {
  const { prefs, toggleEnabled, changeFrequency, refreshPrefs } = useAutoBackupPrefs();
  const [snapshots, setSnapshots] = useState([]);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState(null);
  const [pendingRestore, setPendingRestore] = useState(null);

  const refreshSnapshots = useCallback(async () => {
    try { setSnapshots(await listSnapshots()); } catch { setSnapshots([]); }
  }, []);

  useEffect(() => { refreshSnapshots(); }, [refreshSnapshots]);

  const createSnapshotNow = async () => {
    setBusy(true);
    setMessage(null);
    try {
      await createSnapshot();
      refreshPrefs();
      await refreshSnapshots();
      setMessage({ kind: 'ok', code: 'snapshotCreated' });
    } catch {
      setMessage({ kind: 'error', code: 'errExportFailed' });
    } finally {
      setBusy(false);
    }
  };

  const confirmRestore = async () => {
    if (!pendingRestore) return;
    const key = pendingRestore.key || pendingRestore.id;
    setPendingRestore(null);
    setBusy(true);
    const res = await restoreSnapshot(key);
    setBusy(false);
    if (!res.success) {
      setMessage({ kind: 'error', code: res.error || 'errRestoreFailed' });
      return;
    }
    setMessage({ kind: 'ok', code: 'snapshotRestored' });
    onDataRestored?.();
  };

  const removeSnapshot = async (item) => {
    await deleteSnapshot(item.key || item.id);
    await refreshSnapshots();
    setMessage({ kind: 'ok', code: 'snapshotDeleted' });
  };

  const downloadSnapshot = (item) => {
    const d = (item.createdAt || item.exportedAt || 'snapshot').slice(0, 10);
    downloadFile(JSON.stringify(item, null, 2), `myplano-snapshot-${d}.json`, 'application/json');
  };

  return {
    prefs, toggleEnabled, changeFrequency, snapshots, busy, message,
    pendingRestore, setPendingRestore, createSnapshotNow, confirmRestore,
    removeSnapshot, downloadSnapshot, snapshotMeta,
  };
}
