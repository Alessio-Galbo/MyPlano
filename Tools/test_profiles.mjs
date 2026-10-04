// Profile ownership tests, no dependencies: `node Tools/test_profiles.mjs`.
import { registerHooks } from 'node:module';
import { fileURLToPath, pathToFileURL } from 'node:url';

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
const { findOrphanItems, pickInitialProfileId, hasProfile, assignOrphanItems, orphanKey } =
  await load('core/profiles/orphanItems.js');
const { countBackupOrphans } = await load('core/storage/backupValidation.js');

let fails = 0;
const eq = (name, got, exp) => {
  const ok = JSON.stringify(got) === JSON.stringify(exp);
  if (!ok) { fails += 1; console.log(`FAIL ${name}\n  got ${JSON.stringify(got)}\n  exp ${JSON.stringify(exp)}`); }
};

const profiles = [{ id: 'p1', name: 'Personale' }, { id: 'p2', name: 'Lavoro' }, { id: 7, name: 'Num' }];
const expenses = [
  { id: 'e1', title: 'Luce', profileId: 'p1' },
  { id: 'e2', title: 'Orfana', profileId: '' },
  { id: 'e3', title: 'Senza campo' },
  { id: 'e4', title: 'Id numerico', profileId: '7' },
];
const documents = [
  { id: 'd1', title: 'CI', profileId: 'p2' },
  { id: 'd2', title: 'Patente', profileId: 'ghost' },
];

const orphans = findOrphanItems(expenses, documents, profiles);
eq('orphans found', orphans.map(orphanKey), ['expense|e2', 'expense|e3', 'document|d2']);
eq('orphans keep item', orphans[2].item, documents[1]);
eq('no profiles -> all orphans', findOrphanItems(expenses, documents, []).length, 6);
eq('bad input', findOrphanItems(null, undefined, profiles), []);
eq('no orphans', findOrphanItems([expenses[0]], [documents[0]], profiles), []);

eq('initial: selected', pickInitialProfileId('p2', profiles), 'p2');
eq('initial: all -> first', pickInitialProfileId('all', profiles), 'p1');
eq('initial: deleted selected -> first', pickInitialProfileId('gone', profiles), 'p1');
eq('initial: numeric id kept', pickInitialProfileId('7', profiles), 7);
eq('initial: none', pickInitialProfileId('all', []), '');
eq('hasProfile empty', hasProfile(profiles, ''), false);
eq('hasProfile ok', hasProfile(profiles, 'p2'), true);

const assigned = assignOrphanItems(orphans, { 'expense|e2': 'p2', 'document|d2': 'ghost' }, profiles);
eq('assign only valid choices', assigned, [{ kind: 'expense', item: { id: 'e2', title: 'Orfana', profileId: 'p2' } }]);
eq('assign does not mutate', expenses[1].profileId, '');

const bk = (p, e, d) => ({ myplano_profiles: p, myplano_expenses: e, myplano_documents: d });
eq('backup orphans', countBackupOrphans(bk(profiles, expenses, documents)), 3);
eq('backup orphans none', countBackupOrphans(bk(profiles, [expenses[0]])), 0);
eq('backup orphans no profiles key', countBackupOrphans(bk(undefined, [expenses[0]])), 1);

console.log(fails ? `${fails} test falliti` : 'test_profiles: tutti i test passati');
process.exit(fails ? 1 : 0);
