import { setDbItem, getDbItem, removeDbItem } from './indexedDbHelper';
import { optimizeReceiptImage } from './imageOptimizer';
import { injectJpegExifTags } from './jpegExifWriter';

export async function selectArchiveDirectory() {
  if (!('showDirectoryPicker' in window)) return null;
  try {
    const handle = await window.showDirectoryPicker({ mode: 'readwrite' });
    await setDbItem('archive_dir_handle', handle);
    return handle.name;
  } catch { return null; }
}

export async function getConnectedDirectoryName() {
  try {
    const handle = await getDbItem('archive_dir_handle');
    return handle ? handle.name : null;
  } catch { return null; }
}

export async function disconnectArchiveDirectory() {
  await removeDbItem('archive_dir_handle');
}

async function appendRootIndex(dirHandle, entry) {
  try {
    const h = await dirHandle.getFileHandle('myplano_archive_index.json', { create: true });
    const f = await h.getFile();
    const txt = await f.text().catch(() => '[]');
    const items = txt ? JSON.parse(txt) : [];
    items.push(entry);
    const w = await h.createWritable();
    await w.write(JSON.stringify(items, null, 2));
    await w.close();
  } catch {}
}

export async function saveReceiptToArchive({ file, expense, dueDate, index = 1 }) {
  let optFile = await optimizeReceiptImage(file);
  const year = dueDate ? new Date(dueDate).getFullYear() : new Date().getFullYear();
  const category = expense.category || 'other';
  const dateStr = (dueDate || 'data').replace(/-/g, ' ');
  const safeTitle = (expense.title || 'Spesa').replace(/[/\\?%*:|"<>]/g, '-');
  const ext = optFile.name.includes('.') ? optFile.name.slice(optFile.name.lastIndexOf('.')) : '';
  const cleanName = `${dateStr} - ${safeTitle}${index > 1 ? ` (${index})` : ''}${ext}`;

  if (optFile.type === 'image/jpeg') {
    try {
      const buf = await optFile.arrayBuffer();
      const tagged = injectJpegExifTags(buf, [expense.title, category, String(year), 'MyPlano']);
      optFile = new File([tagged], cleanName, { type: 'image/jpeg' });
    } catch {}
  }

  const dirHandle = await getDbItem('archive_dir_handle');
  if (dirHandle) {
    try {
      const yearDir = await dirHandle.getDirectoryHandle(String(year), { create: true });
      const catDir = await yearDir.getDirectoryHandle(category, { create: true });
      const fileHandle = await catDir.getFileHandle(cleanName, { create: true });
      const writable = await fileHandle.createWritable();
      await writable.write(optFile);
      await writable.close();

      const record = { id: `att_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`, name: cleanName, path: `${year}/${category}/${cleanName}`, storage: 'fs', type: optFile.type, size: optFile.size, savedAt: new Date().toISOString() };
      await appendRootIndex(dirHandle, record);
      return record;
    } catch { /* Fallback to idb */ }
  }

  await setDbItem(`blob_${cleanName}`, optFile);
  return { id: `att_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`, name: cleanName, storage: 'idb', type: optFile.type, size: optFile.size };
}

export async function openReceiptFromArchive(receipt) {
  if (!receipt) return;
  if (receipt.dataUrl) return window.open(receipt.dataUrl, '_blank');
  if (receipt.storage === 'fs' && receipt.path) {
    try {
      const dirHandle = await getDbItem('archive_dir_handle');
      if (dirHandle) {
        const parts = receipt.path.split('/');
        const yearDir = await dirHandle.getDirectoryHandle(parts[0]);
        const catDir = await yearDir.getDirectoryHandle(parts[1]);
        const fileHandle = await catDir.getFileHandle(parts[2]);
        const file = await fileHandle.getFile();
        return window.open(URL.createObjectURL(file), '_blank');
      }
    } catch { /* Fallback */ }
  }
  const blob = await getDbItem(`blob_${receipt.name}`);
  if (blob) window.open(URL.createObjectURL(blob), '_blank');
}
