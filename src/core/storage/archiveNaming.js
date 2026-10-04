export function uniqueId() {
  if (globalThis.crypto?.randomUUID) return globalThis.crypto.randomUUID();
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}

// IndexedDB key of a receipt: new records carry their own unique `blobKey`,
// old ones were keyed by file name (kept readable for compatibility).
export function receiptBlobKey(receipt) {
  return receipt?.blobKey || `blob_${receipt?.name}`;
}

// Never overwrite an existing file: "name.ext" -> "name (2).ext" -> ...
export async function freeFileName(dir, name) {
  const dot = name.lastIndexOf('.');
  const base = dot > 0 ? name.slice(0, dot) : name;
  const ext = dot > 0 ? name.slice(dot) : '';
  for (let n = 1; n < 1000; n += 1) {
    const candidate = n === 1 ? name : `${base} (${n})${ext}`;
    try { await dir.getFileHandle(candidate); } catch { return candidate; }
  }
  return `${base} (${uniqueId()})${ext}`;
}
