// Per-expense notice (`alertDays`) and the global default, loaded by test_notifications.mjs (not a standalone runner).
export async function run({ load, check, assert }) {
  const { getUpcomingDeadlines } = await load('modules/budget/calculations/upcomingHelper.js');
  const { normalizeAlertDays, getExpenseAlertDays } = await load('core/notifications/alertDays.js');
  const today = '2026-10-04';
  const exps = [
    { id: 'in10', title: 'A10', amount: 1, frequency: 'oneOff', nextDueDate: '2026-10-14', alertDays: 7 },
    { id: 'in5', title: 'A5', amount: 1, frequency: 'oneOff', nextDueDate: '2026-10-09', alertDays: 7 },
    { id: 'in10b', title: 'B10', amount: 1, frequency: 'oneOff', nextDueDate: '2026-10-14', alertDays: 14 },
    { id: 'def20', title: 'D20', amount: 1, frequency: 'oneOff', nextDueDate: '2026-10-24' },
    { id: 'mon', title: 'M', amount: 1, frequency: 'monthly', nextDueDate: '2026-10-06', alertDays: 40 },
    { id: 'offd', title: 'Off', amount: 1, frequency: 'oneOff', nextDueDate: '2026-10-24', alertDays: 3, enableAlert: false },
  ];
  const ids = (opts) => getUpcomingDeadlines(exps, [], 'all', today, opts).map((i) => i.id);
  const base = ids();

  check('alertDays 7: due in 10 days out, due in 5 days in', () => {
    assert.ok(!base.includes('exp-in10@2026-10-14') && base.includes('exp-in5@2026-10-09'));
    assert.ok(base.includes('exp-in10b@2026-10-14'));
  });
  check('no alertDays: default 30 (unchanged behaviour)', () => assert.ok(base.includes('exp-def20@2026-10-24')));
  check('default changed: 14 excludes due in 20 days, 21 includes it', () => {
    assert.ok(!ids({ expenseAlertDays: 14 }).includes('exp-def20@2026-10-24'));
    assert.ok(ids({ expenseAlertDays: 21 }).includes('exp-def20@2026-10-24'));
    assert.ok(ids({ expenseAlertDays: 3 }).includes('exp-in5@2026-10-09'), 'own alertDays wins over the default');
  });
  check('own alertDays 40 on a monthly expense: two occurrences', () => {
    assert.deepEqual(base.filter((x) => x.startsWith('exp-mon@')), ['exp-mon@2026-10-06', 'exp-mon@2026-11-06']);
  });
  check('alert off: global default window, flagged off', () => {
    const it = getUpcomingDeadlines(exps, [], 'all', today).find((i) => i.entityId === 'offd');
    assert.ok(it && it.alertEnabled === false);
    assert.ok(!ids({ expenseAlertDays: 10 }).some((x) => x.startsWith('exp-offd')));
  });
  check('normalizeAlertDays / getExpenseAlertDays', () => {
    assert.deepEqual(['', null, 0, -3, 'x', '12', 7.9, 999].map((v) => normalizeAlertDays(v)), [30, 30, 30, 30, 30, 12, 7, 365]);
    assert.equal(getExpenseAlertDays({}, 14), 14);
    assert.equal(getExpenseAlertDays({ alertDays: 5 }, 14), 5);
    assert.equal(getExpenseAlertDays({ alertDays: '' }, 'bad'), 30);
  });
}
