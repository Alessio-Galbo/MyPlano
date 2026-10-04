// Notification tests, no dependencies: `node Tools/test_notifications.mjs` (runs itself in Rome and New York TZ).
// Deadlines (overdue / alertDays / enableAlert), dismissed-id migration and pruning; .ics cases in test_notifications_ics.mjs.
import { registerHooks } from 'node:module';
import { spawnSync } from 'node:child_process';
import { fileURLToPath, pathToFileURL } from 'node:url';
import assert from 'node:assert/strict';

if (!process.env.MYPLANO_TZ_CHILD) {
  let failed = false;
  for (const tz of ['Europe/Rome', 'America/New_York']) {
    const r = spawnSync(process.execPath, [fileURLToPath(import.meta.url)], {
      env: { ...process.env, TZ: tz, MYPLANO_TZ_CHILD: '1' }, stdio: 'inherit',
    });
    failed = failed || r.status !== 0;
  }
  process.exit(failed ? 1 : 0);
}

// Vite-style extensionless imports -> try '.js'.
registerHooks({
  resolve(spec, ctx, next) {
    try { return next(spec, ctx); } catch (e) {
      if (spec.startsWith('.') && !/\.[cm]?js$/.test(spec)) return next(`${spec}.js`, ctx);
      throw e;
    }
  },
});

const src = new URL('../src/', import.meta.url);
const load = (p) => import(pathToFileURL(fileURLToPath(new URL(p, src))).href);
const { getUpcomingDeadlines } = await load('modules/budget/calculations/upcomingHelper.js');
const { pruneDismissedIds, isItemDismissed } = await load('components/layout/notificationDismissal.js');

let fails = 0;
const check = (name, fn) => {
  try { fn(); } catch (e) { fails++; console.log(`  FAIL ${name}\n    ${e.message.split('\n').join('\n    ')}`); }
};

const today = '2026-10-04';
const exps = [
  { id: 'm1', title: 'Luce', amount: 50, frequency: 'monthly', nextDueDate: '2026-09-09', profileId: 'p1', enableAlert: true,
    installments: { '2026-09-09': { status: 'paid' } } },
  { id: 'od', title: 'Gas', amount: 30, frequency: 'monthly', nextDueDate: '2026-09-20', profileId: 'p1' },
  { id: 'off', title: 'Off', amount: 10, frequency: 'oneOff', nextDueDate: '2026-10-10', enableAlert: false, profileId: 'p2' },
  { id: 'old', title: 'Old', amount: 10, frequency: 'monthly', nextDueDate: '2026-05-01', endDate: '2026-06-30' },
];
const docs = [
  { id: 'd60', title: 'Passaporto', expiryDate: '2026-11-18', alertDays: 60 },
  { id: 'd30', title: 'CI', expiryDate: '2026-11-18' },
  { id: 'dno', title: 'Patente', expiryDate: '2026-10-20', enableAlert: false },
  { id: 'dexp', title: 'Tessera', expiryDate: '2026-09-01', alertDays: 30 },
  { id: 'danc', title: 'Antico', expiryDate: '2025-01-01' },
];
const items = getUpcomingDeadlines(exps, docs, 'all', today);
const ids = items.map((i) => i.id);

check('per-occurrence ids, paid excluded', () => {
  assert.ok(ids.includes('exp-m1@2026-10-09'));
  assert.ok(!ids.includes('exp-m1@2026-09-09'));
});
check('overdue unpaid expense', () => assert.ok(items.find((i) => i.id === 'exp-od@2026-09-20')?.isOverdue));
check('document window = alertDays', () => assert.ok(ids.includes('doc-d60@2026-11-18') && !ids.includes('doc-d30@2026-11-18')));
check('expired doc within 60 days only', () => assert.ok(ids.includes('doc-dexp@2026-09-01') && !ids.some((x) => x.startsWith('doc-danc'))));
check('enableAlert false flagged', () => assert.equal(items.find((i) => i.id === 'doc-dno@2026-10-20').alertEnabled, false));
check('ended series ignored', () => assert.ok(!ids.some((x) => x.startsWith('exp-old'))));
check('profile filter', () => assert.deepEqual(getUpcomingDeadlines(exps, docs, 'p2', today).map((i) => i.id), ['exp-off@2026-10-10']));
check('legacy id hides only the next occurrence', () => {
  const od = items.filter((i) => i.entityId === 'od');
  assert.deepEqual(od.map((i) => isItemDismissed(i, new Set(['exp-od']))), od.map((i) => i.date === '2026-10-20'));
});
check('prune + legacy migration', () => {
  const got = pruneDismissedIds(['exp-od', 'exp-gone@2026-10-01', 'exp-m1@2026-01-01', 'doc-d60', 'doc-dexp', 'exp-m1@2026-10-09'], exps, docs, today);
  assert.deepEqual(got, ['exp-od@2026-10-20', 'exp-gone@2026-10-01', 'doc-d60@2026-11-18', 'doc-dexp@2026-09-01', 'exp-m1@2026-10-09']);
});
check('undo: deleted item keeps recent ids', () => {
  assert.deepEqual(pruneDismissedIds(['exp-gone@2026-09-01', 'exp-gone@2026-07-01', 'exp-gone'], exps, docs, today), ['exp-gone@2026-09-01', 'exp-gone']);
});
check('legacy doc id on expired document', () => {
  const dexp = items.find((i) => i.id === 'doc-dexp@2026-09-01');
  assert.ok(isItemDismissed(dexp, new Set(['doc-dexp'])) && isItemDismissed(dexp, new Set(['doc-dexp@2026-09-01'])));
  assert.deepEqual(pruneDismissedIds(['doc-danc'], exps, docs, today), []);
});
check('unchanged list keeps identity; empty data never prunes', () => {
  const same = ['exp-m1@2026-10-09'];
  assert.equal(pruneDismissedIds(same, exps, docs, today), same);
  assert.equal(pruneDismissedIds(['x'], [], [], today).length, 1);
});

const { run: runIcs } = await import(new URL('./test_notifications_ics.mjs', import.meta.url).href);
await runIcs({ load, check, assert, exps, docs });
console.log(`[${process.env.TZ}] test_notifications: ${fails ? `${fails} FAILED` : 'all passed'}`);
process.exit(fails ? 1 : 0);
