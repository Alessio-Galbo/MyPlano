import { buildBackup, parseBackup, readAllDataKeys } from './backupFormat';
import { collectAttachments, restoreAttachments } from './backupAttachments';
import { writeDataAtomically, rollback } from './backupWriter';
import { runMigrations } from './migrations';

export { parseBackup, snapshotToBackupJson } from './backupFormat';
export { writeDataAtomically } from './backupWriter';

// An older backup is brought up to the current schema right after the import
// (every step is idempotent, so they are all re-applied).
function runPostImportMigrations() {
  runMigrations({ fromVersion: 0 });
}

// Sync export without attachments (kept for storageService.exportAllData).
export function exportAllAppData() {
  return JSON.stringify(buildBackup(), null, 2);
}

export async function exportBackupJson({ includeAttachments = false } = {}) {
  const attachments = includeAttachments ? await collectAttachments() : undefined;
  return JSON.stringify(buildBackup(attachments), null, 2);
}

// Sync import without attachments (kept for storageService.importAllData).
export function importAllAppData(_storage, jsonString) {
  const parsed = parseBackup(jsonString);
  if (!parsed.ok) return { success: false, error: parsed.error };
  const res = writeDataAtomically(parsed.data);
  if (res.success) runPostImportMigrations();
  return res;
}

// Applies a backup already checked by parseBackup: data keys first (all-or-nothing),
// then the attachments. If an attachment cannot be saved, restoreAttachments puts the
// previous receipts back and the data keys are rolled back to the snapshot.
export async function applyParsedBackup(parsed) {
  if (!parsed?.ok) return { success: false, error: parsed?.error || 'invalidFormat' };
  const snapshot = readAllDataKeys();
  const res = writeDataAtomically(parsed.data, snapshot);
  if (!res.success) return res;
  try {
    await restoreAttachments(parsed.attachments);
  } catch {
    return rollback(snapshot, 'attachmentsFailed');
  }
  runPostImportMigrations();
  return res;
}
