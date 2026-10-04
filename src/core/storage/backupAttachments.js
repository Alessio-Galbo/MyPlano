import { getDbEntries, getDbItem, setDbItem, removeDbItem } from './indexedDbHelper';
import { uniqueId } from './archiveNaming';

// Receipts kept in IndexedDB (keys `blob_*`) travel inside the backup JSON as base64.
// Receipts saved in a connected PC folder stay in that folder and are not included.
const BLOB_PREFIX = 'blob_';
const CHUNK = 0x8000;

function bytesToBase64(bytes) {
  let bin = '';
  for (let i = 0; i < bytes.length; i += CHUNK) {
    bin += String.fromCharCode.apply(null, bytes.subarray(i, i + CHUNK));
  }
  return btoa(bin);
}

function base64ToBytes(b64) {
  const bin = atob(b64);
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i += 1) bytes[i] = bin.charCodeAt(i);
  return bytes;
}

async function listBlobs() {
  const entries = await getDbEntries(BLOB_PREFIX);
  return entries.filter(([, v]) => v instanceof Blob);
}

export async function getAttachmentsSize() {
  const blobs = await listBlobs();
  return { count: blobs.length, bytes: blobs.reduce((s, [, b]) => s + b.size, 0) };
}

export async function collectAttachments() {
  const blobs = await listBlobs();
  return Promise.all(blobs.map(async ([key, blob]) => ({
    key,
    name: blob.name || '',
    type: blob.type || 'application/octet-stream',
    data: bytesToBase64(new Uint8Array(await blob.arrayBuffer())),
  })));
}

async function sameContent(a, b) {
  if (!(a instanceof Blob) || a.size !== b.size || a.type !== b.type) return false;
  const [x, y] = await Promise.all([a.arrayBuffer(), b.arrayBuffer()]);
  const u = new Uint8Array(x);
  const v = new Uint8Array(y);
  return u.every((byte, i) => byte === v[i]);
}

// Saves the backup receipts. A different receipt already stored under the same key
// (old `blob_<name>` keys) is kept under `blob_replaced_<uuid>`, never lost. If a write
// fails, every key touched is put back as it was and the error is rethrown.
export async function restoreAttachments(list) {
  const journal = [];
  try {
    for (const a of list) {
      const bytes = base64ToBytes(a.data);
      const blob = a.name ? new File([bytes], a.name, { type: a.type }) : new Blob([bytes], { type: a.type });
      const prev = await getDbItem(a.key);
      if (prev !== undefined && await sameContent(prev, blob)) continue;
      journal.push([a.key, prev]);
      await setDbItem(a.key, blob);
    }
  } catch (error) {
    for (const [key, prev] of journal.reverse()) {
      try {
        if (prev === undefined) await removeDbItem(key);
        else await setDbItem(key, prev);
      } catch { /* best effort */ }
    }
    throw error;
  }
  for (const [, prev] of journal) {
    if (prev !== undefined) await setDbItem(`${BLOB_PREFIX}replaced_${uniqueId()}`, prev).catch(() => {});
  }
  return list.length;
}
