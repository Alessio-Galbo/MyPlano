const DB_NAME = 'myplano_archive_db';
const STORE_NAME = 'archive_store';

function openDb() {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, 1);
    req.onupgradeneeded = () => req.result.createObjectStore(STORE_NAME);
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

export async function setDbItem(key, val) {
  const db = await openDb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    tx.objectStore(STORE_NAME).put(val, key);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

export async function getDbItem(key) {
  const db = await openDb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readonly');
    const req = tx.objectStore(STORE_NAME).get(key);
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

export async function removeDbItem(key) {
  const db = await openDb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    tx.objectStore(STORE_NAME).delete(key);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

// All [key, value] pairs whose key starts with `prefix` (e.g. 'blob_' for receipts).
export async function getDbEntries(prefix) {
  const db = await openDb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readonly');
    const store = tx.objectStore(STORE_NAME);
    const keysReq = store.getAllKeys();
    const valsReq = store.getAll();
    tx.oncomplete = () => {
      const pairs = keysReq.result.map((k, i) => [k, valsReq.result[i]]);
      resolve(pairs.filter(([k]) => typeof k === 'string' && k.startsWith(prefix)));
    };
    tx.onerror = () => reject(tx.error);
  });
}

export async function removeDbItemsByPrefix(prefix) {
  const entries = await getDbEntries(prefix);
  const db = await openDb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    entries.forEach(([k]) => tx.objectStore(STORE_NAME).delete(k));
    tx.oncomplete = () => resolve(entries.length);
    tx.onerror = () => reject(tx.error);
  });
}
