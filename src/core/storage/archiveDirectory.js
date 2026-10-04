import { setDbItem, getDbItem, removeDbItem } from './indexedDbHelper';

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

export async function appendRootIndex(dirHandle, entry) {
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
