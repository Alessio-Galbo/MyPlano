// System notification tests, no dependencies: `node Tools/test_system_notifications.mjs`.
// Pure parts only: the mirror built by the page (src/core/notifications/buildMirror.js) and the summary +
// "already notified" log used by the Service Worker (public/sw-notify-core.js, loaded in a vm sandbox).
import { loaderFor } from './test_harness.mjs';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';

const root = new URL('../', import.meta.url);
const load = loaderFor(root);
const { buildMirror } = await load('src/core/notifications/buildMirror.js');
const sandbox = { self: {} };
vm.runInNewContext(readFileSync(new URL('public/sw-notify-core.js', root), 'utf8'), sandbox);
const { summarize, markNotified, localToday } = sandbox.self.MyPlanoNotifyCore;
const texts = JSON.parse(readFileSync(new URL('src/core/i18n/locales/it/common.json', root), 'utf8')).systemNotifications.push;

let fails = 0;
const check = (name, fn) => {
  try { fn(); } catch (e) { fails++; console.log(`  FAIL ${name}\n    ${e.message.split('\n').join('\n    ')}`); }
};

const today = '2026-10-04';
const exps = [
  { id: 'aff', title: 'Affitto', amount: 500, frequency: 'monthly', nextDueDate: '2026-10-04' },
  { id: 'luce', title: 'Luce', amount: 50, frequency: 'monthly', nextDueDate: '2026-10-06',
    installments: { '2026-11-06': { status: 'paid' } } },
  { id: 'gas', title: 'Gas', amount: 30, frequency: 'oneOff', nextDueDate: '2026-09-29' },
  { id: 'off', title: 'Off', amount: 10, frequency: 'oneOff', nextDueDate: '2026-10-05', enableAlert: false },
  { id: 'hid', title: 'Nascosta', amount: 10, frequency: 'oneOff', nextDueDate: '2026-10-07' },
];
const docs = [{ id: 'pas', title: 'Passaporto', expiryDate: '2026-11-20', alertDays: 60 },
  { id: 'ci', title: 'CI', expiryDate: '2026-11-25' }];
const mirror = buildMirror({ expenses: exps, documents: docs, dismissedIds: ['exp-hid@2026-10-07'], enabled: true, texts, today });
const ids = mirror.items.map((i) => i.id);

check('mirror: enableAlert off and hidden excluded', () => assert.ok(!ids.some((x) => /exp-(off|hid)/.test(x))));
check('mirror: paid occurrence excluded, next month kept (valid ~30 days without opening the app)', () => {
  assert.ok(!ids.includes('exp-luce@2026-11-06'));
  assert.ok(ids.includes('exp-aff@2026-11-04') && !ids.includes('exp-luce@2026-12-06'));
});
check('mirror: overdue and documents with their notice', () => {
  assert.ok(ids.includes('exp-gas@2026-09-29'));
  assert.equal(mirror.items.find((i) => i.id === 'doc-pas@2026-11-20').soon, 60);
  assert.equal(mirror.items.find((i) => i.id === 'doc-ci@2026-11-25').soon, 30);
});

const first = summarize(mirror, {}, today);
check('summary: one notification for all due items', () => {
  assert.equal(first.title, 'MyPlano · 4 scadenze');
  assert.equal(first.body, 'Gas in ritardo di 5 gg, Affitto oggi, Luce tra 2 gg, Passaporto tra 47 gg');
});
const log = markNotified({}, first.keys, today);
check('summary: not repeated the same day', () => assert.equal(summarize(mirror, log, today), null));
check('summary: next days only stage changes (today -> overdue, new in window, due today)', () => {
  const d5 = summarize(mirror, log, '2026-10-05');
  assert.equal(d5.body, 'Affitto in ritardo di 1 gg, Affitto tra 30 gg');
  const s = summarize(mirror, markNotified(log, d5.keys, '2026-10-05'), '2026-10-06');
  assert.equal(s.title, 'MyPlano · 1 scadenza');
  assert.equal(s.body, 'Luce oggi');
});
check('summary: muted or disabled -> nothing', () => {
  assert.equal(summarize({ ...mirror, muted: true }, {}, today), null);
  assert.equal(summarize({ ...mirror, enabled: false }, {}, today), null);
  assert.equal(summarize(null, {}, today), null);
});
check('summary: tomorrow text and more than 60 days overdue ignored', () => {
  const m = { ...mirror, items: [{ id: 'a', date: '2026-10-05', title: 'A', soon: 30 }, { id: 'b', date: '2026-07-01', title: 'B', soon: 30 }] };
  assert.equal(summarize(m, {}, today).body, 'A domani');
});
check('summary: at most 4 lines + "+N altre"', () => {
  const items = ['a', 'b', 'c', 'd', 'e', 'f'].map((id, i) => ({ id, date: `2026-10-1${i}`, title: id.toUpperCase(), soon: 30 }));
  const s = summarize({ ...mirror, items }, {}, today);
  assert.ok(s.body.endsWith(', +2 altre') && s.title === 'MyPlano · 6 scadenze');
});
check('log: entries older than 60 days pruned', () => {
  const pruned = markNotified({ 'x#today': '2026-07-01', 'y#soon': '2026-09-01' }, ['z#today'], today);
  assert.deepEqual(Object.keys(pruned).sort(), ['y#soon', 'z#today']);
});
const { run: runAlert } = await import(new URL('./test_system_notifications_alert.mjs', import.meta.url).href);
runAlert({ buildMirror, summarize, mirror, texts, today, check, assert });
check('localToday uses local calendar date', () => assert.equal(localToday(new Date(2026, 0, 5, 23, 59)), '2026-01-05'));

console.log(fails ? `FAILED (${fails})` : 'ALL TESTS PASSED');
process.exit(fails ? 1 : 0);
