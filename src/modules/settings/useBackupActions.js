import { useState, useEffect } from 'react';
import { usePersistentState } from '../../hooks/usePersistentState';
import { todayISO } from '../../core/dates/isoDate';
import { exportBackupJson, parseBackup, applyParsedBackup, snapshotToBackupJson } from '../../core/storage/exportImportService';
import { getAttachmentsSize } from '../../core/storage/backupAttachments';
import { countBackupOrphans } from '../../core/storage/backupValidation';
import { downloadFile } from './icsExportHelper';

// 'invalidJson' -> 'errInvalidJson' (common.backup.err*)
const errorMessage = (code) => ({ kind: 'error', code: `err${code.charAt(0).toUpperCase()}${code.slice(1)}` });

// State and actions of the backup card. `message` is { kind: 'ok' | 'error', code }.
export function useBackupActions(onDataRestored) {
  const [lastBackupAt, setLastBackupAt] = usePersistentState('lastBackupAt', null,
    (v) => typeof v === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(v));
  const [includeAttachments, setIncludeAttachments] = usePersistentState('backupIncludeAttachments', false,
    (v) => typeof v === 'boolean');
  const [attachmentsSize, setAttachmentsSize] = useState(null);
  const [pending, setPending] = useState(null);
  const [message, setMessage] = useState(null);
  const [busy, setBusy] = useState(false);
  const [recovery, setRecovery] = useState(null); // data before a failed import

  useEffect(() => {
    if (!includeAttachments) return;
    getAttachmentsSize().then(setAttachmentsSize).catch(() => setAttachmentsSize(null));
  }, [includeAttachments]);

  const exportBackup = async () => {
    setBusy(true);
    try {
      const json = await exportBackupJson({ includeAttachments });
      downloadFile(json, `myplano-backup-${todayISO()}.json`, 'application/json');
      setLastBackupAt(todayISO());
      setMessage({ kind: 'ok', code: 'exported' });
    } catch {
      setMessage({ kind: 'error', code: 'errExportFailed' });
    } finally {
      setBusy(false);
    }
  };

  const chooseFile = async (e) => {
    const input = e.target;
    const file = input.files?.[0];
    input.value = ''; // the same file can be chosen again
    if (!file) return;
    setMessage(null);
    let text;
    try { text = await file.text(); } catch { setMessage({ kind: 'error', code: 'errReadFailed' }); return; }
    const parsed = parseBackup(text);
    if (!parsed.ok) {
      setMessage(errorMessage(parsed.error));
      return;
    }
    setPending({ ...parsed, orphans: countBackupOrphans(parsed.data) });
  };

  const confirmImport = async () => {
    const parsed = pending;
    setPending(null);
    setBusy(true);
    const res = await applyParsedBackup(parsed);
    setBusy(false);
    if (!res.success) {
      setRecovery(res.snapshot || null);
      setMessage(errorMessage(res.error));
      return;
    }
    setRecovery(null);
    setMessage({ kind: 'ok', code: 'restored' });
    onDataRestored?.();
  };

  return {
    lastBackupAt, includeAttachments, setIncludeAttachments, attachmentsSize,
    pending, cancelImport: () => setPending(null), confirmImport, chooseFile, exportBackup,
    message, busy, hasRecovery: Boolean(recovery),
    downloadRecovery: () => downloadFile(snapshotToBackupJson(recovery),
      `myplano-dati-precedenti-${todayISO()}.json`, 'application/json'),
  };
}
