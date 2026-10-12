// Creation, listing, pruning, and restoring of periodic automatic snapshots.
import { buildBackup, parseBackup } from '../backupFormat';
import { applyParsedBackup } from '../exportImportService';
import { DATA_KEYS as K } from '../storageKeys';
import {
  SNAPSHOT_PREFIX,
  DEFAULT_MAX_SNAPSHOTS,
  readAutoBackupPrefs,
  saveAutoBackupPrefs,
  shouldRunAutoBackup,
} from './autoBackupConfig';
import { putSnapshotDb, getSnapshotDb, deleteSnapshotDb, getAllSnapshotsDb } from './autoBackupDb';

export const makeSnapshotId = (date = new Date()) => `${SNAPSHOT_PREFIX}${date.toISOString()}`;

const countList = (list) => (Array.isArray(list) ? list.length : 0);

export function snapshotMeta(snapshot) {
  const data = snapshot?.data || {};
  return {
    profiles: countList(data[K.PROFILES]),
    expenses: countList(data[K.EXPENSES]),
    documents: countList(data[K.DOCUMENTS]),
    createdAt: snapshot?.createdAt || snapshot?.exportedAt || null,
  };
}

export async function listSnapshots() {
  const items = await getAllSnapshotsDb();
  return items.sort((a, b) => {
    const ta = new Date(a.createdAt || a.exportedAt || 0).getTime();
    const tb = new Date(b.createdAt || b.exportedAt || 0).getTime();
    return tb - ta;
  });
}

export async function pruneSnapshots(maxKeep = DEFAULT_MAX_SNAPSHOTS) {
  const items = await listSnapshots();
  if (items.length <= maxKeep) return 0;
  const toDelete = items.slice(maxKeep);
  let deleted = 0;
  for (const item of toDelete) {
    const key = item.key || item.id;
    if (key) {
      await deleteSnapshotDb(key);
      deleted += 1;
    }
  }
  return deleted;
}

export async function createSnapshot({ maxKeep = DEFAULT_MAX_SNAPSHOTS } = {}) {
  const now = new Date();
  const id = makeSnapshotId(now);
  const backup = buildBackup();
  const snapshot = { ...backup, id, createdAt: now.toISOString(), isAutoSnapshot: true };
  await putSnapshotDb(id, snapshot);
  await pruneSnapshots(maxKeep);
  saveAutoBackupPrefs({ lastRunAt: now.toISOString() });
  return snapshot;
}

export async function runAutoBackupIfNeeded({ maxKeep = DEFAULT_MAX_SNAPSHOTS } = {}) {
  const prefs = readAutoBackupPrefs();
  if (!shouldRunAutoBackup({ prefs })) return null;
  return createSnapshot({ maxKeep });
}

export async function restoreSnapshot(key) {
  const item = await getSnapshotDb(key);
  if (!item) return { success: false, error: 'invalidFormat' };
  const parsed = parseBackup(JSON.stringify(item));
  if (!parsed.ok) return { success: false, error: parsed.error };
  return applyParsedBackup(parsed);
}

export const deleteSnapshot = (key) => deleteSnapshotDb(key);
