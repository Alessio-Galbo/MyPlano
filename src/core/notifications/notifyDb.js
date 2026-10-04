// Tiny key/value IndexedDB store read by the Service Worker (public/sw-notify.js).
import { NOTIFY_DB, NOTIFY_STORE } from './notifyConstants';

function openDb() {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(NOTIFY_DB, 1);
    req.onupgradeneeded = () => req.result.createObjectStore(NOTIFY_STORE);
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

function run(mode, fn) {
  return openDb().then((db) => new Promise((resolve, reject) => {
    const tx = db.transaction(NOTIFY_STORE, mode);
    const req = fn(tx.objectStore(NOTIFY_STORE));
    tx.oncomplete = () => { db.close(); resolve(req?.result); };
    tx.onerror = () => { db.close(); reject(tx.error); };
  }));
}

export const getNotifyItem = (key) => run('readonly', (s) => s.get(key));
export const setNotifyItem = (key, value) => run('readwrite', (s) => s.put(value, key));
