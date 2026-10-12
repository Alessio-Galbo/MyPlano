// Automatic backup and snapshot tests: `node Tools/test_auto_backup.mjs`.
import { loaderFor } from './test_harness.mjs';
import { runCadenceTests } from './test_auto_backup_cadence.mjs';

const load = loaderFor(new URL('../src/', import.meta.url));

const storage = new Map();
globalThis.localStorage = {
  getItem: (k) => (storage.has(k) ? storage.get(k) : null),
  setItem: (k, v) => storage.set(k, String(v)),
  removeItem: (k) => storage.delete(k),
  clear: () => storage.clear(),
};

const config = await load('core/storage/autoBackup/autoBackupConfig.js');
const service = await load('core/storage/autoBackup/autoBackupService.js');
const autoBackupDb = await load('core/storage/autoBackup/autoBackupDb.js');

const dbItems = new Map();
autoBackupDb.setDbAdapter({
  put: async (k, v) => { dbItems.set(k, v); return true; },
  get: async (k) => dbItems.get(k) || null,
  delete: async (k) => { dbItems.delete(k); return true; },
  getAll: async () => Array.from(dbItems.entries()).map(([k, v]) => ({ ...v, key: k })),
});

let fails = 0;
const eq = (name, got, exp) => {
  const ok = JSON.stringify(got) === JSON.stringify(exp);
  if (!ok) {
    fails += 1;
    console.log(`FAIL ${name}\n  got ${JSON.stringify(got)}\n  exp ${JSON.stringify(exp)}`);
  }
};

runCadenceTests({
  eq,
  shouldRunAutoBackup: config.shouldRunAutoBackup,
  readAutoBackupPrefs: config.readAutoBackupPrefs,
  saveAutoBackupPrefs: config.saveAutoBackupPrefs,
  snapshotMeta: service.snapshotMeta,
  constants: config,
});

eq('snapshot ID format', service.makeSnapshotId(new Date('2026-10-10T12:00:00.000Z')), 'snapshot_2026-10-10T12:00:00.000Z');

// Listing & Pruning
dbItems.clear();
for (let i = 1; i <= 9; i++) {
  const day = String(i).padStart(2, '0');
  const d = `2026-10-${day}T10:00:00.000Z`;
  const k = `snapshot_${d}`;
  dbItems.set(k, { key: k, id: k, createdAt: d, data: {} });
}

const listBefore = await service.listSnapshots();
eq('listed 9 snapshots descending', listBefore.length, 9);
eq('most recent is first', listBefore[0].createdAt, '2026-10-09T10:00:00.000Z');

const deleted = await service.pruneSnapshots(7);
eq('pruned 2 oldest snapshots', deleted, 2);

const listAfter = await service.listSnapshots();
eq('now exactly 7 snapshots remain', listAfter.length, 7);
eq('oldest remaining is Oct 3', listAfter[6].createdAt, '2026-10-03T10:00:00.000Z');
eq('Oct 1 was pruned', dbItems.has('snapshot_2026-10-01T10:00:00.000Z'), false);

console.log(fails ? `${fails} test falliti` : 'test_auto_backup: tutti i test passati');
process.exit(fails ? 1 : 0);
