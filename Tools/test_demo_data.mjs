// Node test for the sample-data detection (src/components/onboarding/demoCompare.js).
// Run: node Tools/test_demo_data.mjs
import assert from 'node:assert/strict';
import { sameList, sameProfiles, findDemoLeftovers } from '../src/components/onboarding/demoCompare.js';

const seeds = {
  profiles: [{ id: 'p1', name: 'Personale', initialBalance: 100 }, { id: 'p2', name: 'Casa', initialBalance: 0 }],
  expenses: [{ id: 'exp-1', title: 'Auto', amount: 50, profileId: 'p1' }, { id: 'exp-2', title: 'Luce', amount: 20, profileId: 'p2' }],
  documents: [{ id: 'doc-1', title: 'Carta', profileId: 'p1' }],
};
const copy = (x) => JSON.parse(JSON.stringify(x));
let n = 0;
const test = (name, fn) => { fn(); n += 1; console.log(`ok - ${name}`); };

test('intact sample data is recognised', () => {
  const d = copy(seeds);
  assert.ok(sameProfiles(seeds.profiles, d.profiles) && sameList(seeds.expenses, d.expenses));
  assert.deepEqual(findDemoLeftovers(d, seeds).total, 5);
});

test('a profile created from the menu keeps every sample item removable (the reported bug)', () => {
  const d = copy(seeds);
  d.profiles.push({ id: 'p-user', name: 'Mio', initialBalance: 0 });
  assert.equal(sameProfiles(seeds.profiles, d.profiles), false); // the full "start fresh" banner hides
  const left = findDemoLeftovers(d, seeds);
  assert.deepEqual(left.profileIds, ['p1', 'p2']);
  assert.deepEqual(left.expenseIds, ['exp-1', 'exp-2']);
  assert.deepEqual(left.documentIds, ['doc-1']);
});

test('edited sample items and profiles holding user items are kept', () => {
  const d = copy(seeds);
  d.expenses[0].amount = 60; // edited sample expense on p1
  d.expenses.push({ id: 'exp-u', title: 'Mia', amount: 5, profileId: 'p2' }); // user item on p2
  const left = findDemoLeftovers(d, seeds);
  assert.deepEqual(left.expenseIds, ['exp-2']);
  assert.deepEqual(left.profileIds, []);
  assert.deepEqual(left.documentIds, ['doc-1']);
});

test('custom colour, numbers as strings, empty migration fields, custom settings', () => {
  const d = copy(seeds);
  d.profiles[0].initialBalance = '100';
  d.expenses[1].installments = {};
  assert.ok(sameProfiles(seeds.profiles, d.profiles) && sameList(seeds.expenses, d.expenses));
  d.profiles[1].hue = 120;
  assert.deepEqual(findDemoLeftovers(d, seeds).profileIds, ['p1']);
  assert.deepEqual(findDemoLeftovers(copy(seeds), seeds, new Set(['p1'])).profileIds, ['p2']);
});

console.log(`test_demo_data: all ${n} passed`);
