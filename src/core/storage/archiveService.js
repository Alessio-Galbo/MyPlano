import { setDbItem, getDbItem, removeDbItem } from './indexedDbHelper';
import { optimizeReceiptImage } from './imageOptimizer';

export async function selectArchiveDirectory() {
  if (!('showDirectoryPicker' in window)) return null;
  try {
    const handle = await window.showDirectoryPicker({ mode: 'readwrite' });
    await setDbItem('archive_dir_handle', handle);
    return handle.name;
  } catch {
    return null;
  }
}

export async function getConnectedDirectoryName() {
  try {
    const handle = await getDbItem('archive_dir_handle');
    return handle ? handle.name : null;
  } catch {
    return null;
  }
}

export async function disconnectArchiveDirectory() {
  await removeDbItem('archive_dir_handle');
}

export async function saveReceiptToArchive({ file, expense, dueDate }) {
  const optFile = await optimizeReceiptImage(file);
  const year = dueDate ? new Date(dueDate).getFullYear() : new Date().getFullYear();
  const category = expense.category || 'other';
  const safeTitle = (expense.title || 'spesa').replace(/[^a-zA-Z0-9_-]/g, '-');
  const cleanName = `${dueDate || 'data'}_${category}_${safeTitle}_${optFile.name.replace(/[^a-zA-Z0-9._-]/g, '_')}`;

  const dirHandle = await getDbItem('archive_dir_handle');
  if (dirHandle) {
    try {
      const yearDir = await dirHandle.getDirectoryHandle(String(year), { create: true });
      const catDir = await yearDir.getDirectoryHandle(category, { create: true });
      const fileHandle = await catDir.getFileHandle(cleanName, { create: true });
      const writable = await fileHandle.createWritable();
      await writable.write(optFile);
      await writable.close();

      const metaHandle = await catDir.getFileHandle(`${cleanName}.meta.json`, { create: true });
      const metaJson = JSON.stringify({
        expenseId: expense.id,
        title: expense.title,
        category,
        dueDate,
        amount: expense.amount,
        savedAt: new Date().toISOString(),
      }, null, 2);
      const metaWritable = await metaHandle.createWritable();
      await metaWritable.write(metaJson);
      await metaWritable.close();

      return { name: cleanName, path: `${year}/${category}/${cleanName}`, storage: 'fs', type: optFile.type };
    } catch {
      // Fallback if permission revoked or error
    }
  }

  // Fallback in IndexedDB
  await setDbItem(`blob_${cleanName}`, optFile);
  return { name: cleanName, storage: 'idb', type: optFile.type };
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
        const url = URL.createObjectURL(file);
        return window.open(url, '_blank');
      }
    } catch {
      // Fallback
    }
  }

  const blob = await getDbItem(`blob_${receipt.name}`);
  if (blob) {
    const url = URL.createObjectURL(blob);
    window.open(url, '_blank');
  }
}
