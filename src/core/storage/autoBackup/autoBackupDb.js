// IndexedDB persistence for automatic backup snapshots.
import { setDbItem, getDbItem, removeDbItem, getDbEntries } from '../indexedDbHelper';
import { SNAPSHOT_PREFIX } from './autoBackupConfig';

let customAdapter = null;
export function setDbAdapter(adapter) { customAdapter = adapter; }

export async function putSnapshotDb(key, snapshot) {
  if (customAdapter?.put) return customAdapter.put(key, snapshot);
  if (typeof indexedDB === 'undefined') return false;
  await setDbItem(key, snapshot);
  return true;
}

export async function getSnapshotDb(key) {
  if (customAdapter?.get) return customAdapter.get(key);
  if (typeof indexedDB === 'undefined') return null;
  return getDbItem(key);
}

export async function deleteSnapshotDb(key) {
  if (customAdapter?.delete) return customAdapter.delete(key);
  if (typeof indexedDB === 'undefined') return false;
  await removeDbItem(key);
  return true;
}

export async function getAllSnapshotsDb() {
  if (customAdapter?.getAll) return customAdapter.getAll();
  if (typeof indexedDB === 'undefined') return [];
  const entries = await getDbEntries(SNAPSHOT_PREFIX);
  return entries.map(([key, val]) => ({ ...(val || {}), key: key || val?.id }));
}
