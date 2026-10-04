import { setDbItem, getDbItem } from './indexedDbHelper';
import { optimizeReceiptImage } from './imageOptimizer';
import { injectJpegExifTags } from './jpegExifWriter';
import { appendRootIndex } from './archiveDirectory';
import { uniqueId, freeFileName, receiptBlobKey } from './archiveNaming';

export { selectArchiveDirectory, getConnectedDirectoryName, disconnectArchiveDirectory } from './archiveDirectory';
export { receiptBlobKey } from './archiveNaming';

export async function saveReceiptToArchive({ file, expense, dueDate, index = 1 }) {
  let optFile = await optimizeReceiptImage(file);
  const year = dueDate ? Number(String(dueDate).slice(0, 4)) : new Date().getFullYear();
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
      const fileName = await freeFileName(catDir, cleanName);
      const fileHandle = await catDir.getFileHandle(fileName, { create: true });
      const writable = await fileHandle.createWritable();
      await writable.write(optFile);
      await writable.close();

      const record = { id: `att_${uniqueId()}`, name: fileName, path: `${year}/${category}/${fileName}`, storage: 'fs', type: optFile.type, size: optFile.size, savedAt: new Date().toISOString() };
      await appendRootIndex(dirHandle, record);
      return record;
    } catch { /* Fallback to idb */ }
  }

  const blobKey = `blob_${uniqueId()}`;
  await setDbItem(blobKey, optFile);
  return { id: `att_${uniqueId()}`, name: cleanName, blobKey, storage: 'idb', type: optFile.type, size: optFile.size };
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
  const blob = await getDbItem(receiptBlobKey(receipt));
  if (blob) window.open(URL.createObjectURL(blob), '_blank');
}
