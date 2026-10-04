// Recurrence/date tests, no dependencies: `node Tools/test_dates.mjs` (runs itself in Rome and New York TZ).
import { registerHooks } from 'node:module';
import { spawnSync } from 'node:child_process';
import { fileURLToPath, pathToFileURL } from 'node:url';

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
const { getOccurrences } = await load('core/dates/recurrence.js');
const { todayISO, addDays } = await load('core/dates/isoDate.js');
const inst = await load('modules/expenses/expenseInstallmentHelpers.js');
const { advanceNextDueDate, getExpenseUrgency } = await load('modules/expenses/expenseHelpers.js');
const { calculateNextFutureOccurrence, isDateInPast } = await load('modules/expenses/pastDateHelpers.js');
const { calculateRenewalDate } = await load('modules/documents/documentHelpers.js');
const { calculateBudgetMetrics, calculateItemAnnualCost } = await load('modules/budget/calculations/coreMetrics.js');
const { countDueInMonth } = await load('modules/budget/calculations/recurrenceHelper.js');

let fails = 0;
const eq = (name, got, exp) => {
  const ok = JSON.stringify(got) === JSON.stringify(exp);
  if (!ok) { fails++; console.log(`  FAIL ${name}\n    got: ${JSON.stringify(got)}\n    exp: ${JSON.stringify(exp)}`); }
};
const exp = (o) => ({ id: 'e', amount: 100, ...o });
const m15 = exp({ frequency: 'monthly', nextDueDate: '2026-10-15' });

eq('monthly 15, 12 months 2027', inst.getExpenseDatesInYear(m15, 2027),
  Array.from({ length: 12 }, (_, i) => `2027-${String(i + 1).padStart(2, '0')}-15`));
eq('monthly 15, before origin', inst.getExpenseDatesInYear(m15, 2025), []);
eq('31/01 monthly', getOccurrences(exp({ frequency: 'monthly', nextDueDate: '2026-01-31' }), '2026-01-01', '2026-05-31'),
  ['2026-01-31', '2026-02-28', '2026-03-31', '2026-04-30', '2026-05-31']);
eq('bimonthly', inst.getExpenseDatesInYear(exp({ frequency: 'bimonthly', nextDueDate: '2026-01-10' }), 2026),
  ['2026-01-10', '2026-03-10', '2026-05-10', '2026-07-10', '2026-09-10', '2026-11-10']);
eq('quarterly', inst.getExpenseDatesInYear(exp({ frequency: 'quarterly', nextDueDate: '2025-11-30' }), 2026),
  ['2026-02-28', '2026-05-30', '2026-08-30', '2026-11-30']);
eq('custom 15 days', getOccurrences(exp({ frequency: 'custom', customInterval: 15, customUnit: 'days', nextDueDate: '2026-03-20' }),
  '2026-03-01', '2026-04-30'), ['2026-03-20', '2026-04-04', '2026-04-19']);
eq('custom 2 months', getOccurrences(exp({ frequency: 'custom', customInterval: 2, customUnit: 'months', nextDueDate: '2026-01-15' }),
  '2026-01-01', '2026-06-30'), ['2026-01-15', '2026-03-15', '2026-05-15']);
eq('endDate', inst.getExpenseDatesInYear({ ...m15, endDate: '2027-03-15' }, 2027), ['2027-01-15', '2027-02-15', '2027-03-15']);
eq('excludedDates', getOccurrences({ ...m15, excludedDates: ['2026-11-15'] }, '2026-10-01', '2026-12-31'), ['2026-10-15', '2026-12-15']);
eq('oneOff', inst.getExpenseDatesInYear(exp({ frequency: 'oneOff', nextDueDate: '2026-12-05' }), 2026), ['2026-12-05']);
eq('oneOff other year', inst.getExpenseDatesInYear(exp({ frequency: 'oneOff', nextDueDate: '2026-12-05' }), 2027), []);
eq('annual 29/02', getOccurrences(exp({ frequency: 'annual', nextDueDate: '2028-02-29' }), '2028-01-01', '2032-12-31'),
  ['2028-02-29', '2029-02-28', '2030-02-28', '2031-02-28', '2032-02-29']);
eq('biennial', getOccurrences(exp({ frequency: 'biennial', nextDueDate: '2026-06-01' }), '2026-01-01', '2030-12-31'),
  ['2026-06-01', '2028-06-01', '2030-06-01']);
eq('extra installment included', getOccurrences({ ...m15, installments: { '2026-10-20': { isExtra: true } } }, '2026-10-01', '2026-10-31'),
  ['2026-10-15', '2026-10-20']);

eq('advanceDate 15/03', inst.advanceDate('2026-03-15', 'monthly'), '2026-04-15');
eq('advanceDate 31/01', inst.advanceDate('2026-01-31', 'monthly'), '2026-02-28');
eq('advanceDate custom days', inst.advanceDate('2026-03-20', 'custom', 15, 'days'), '2026-04-04');
eq('advanceNextDueDate', advanceNextDueDate('2026-03-15', 'monthly'), '2026-04-15');
eq('advanceNextDueDate days', advanceNextDueDate('2026-03-20', 'custom', 15, 'days'), '2026-04-04');
eq('next installment grid', inst.findNextInstallmentDate(exp({ frequency: 'monthly', nextDueDate: '2026-01-31' }), '2026-02-28'), '2026-03-31');
eq('renewal', calculateRenewalDate('2026-03-15', 5), '2031-03-15');

const today = todayISO();
eq('isDateInPast(today)', isDateInPast(today), false);
eq('isDateInPast(yesterday)', isDateInPast(addDays(today, -1)), true);
eq('urgency today', getExpenseUrgency(today).label, 'upcoming');
eq('next future occurrence', calculateNextFutureOccurrence(addDays(today, -1), 'annual') > today, true);
eq('due today counted', calculateBudgetMetrics([exp({ frequency: 'monthly', nextDueDate: today })]).upcoming30DaysCount, 1);
eq('ended expense quota 0', calculateItemAnnualCost({ ...m15, endDate: '2026-01-01' }, '2026-10-04'), 0);
eq('full quota', calculateItemAnnualCost(m15, '2026-10-04'), 1200);
eq('skip 1 of 12', Math.round(calculateItemAnnualCost({ ...m15, excludedDates: ['2026-11-15'] }, '2026-10-04')), 1100);
eq('custom days annual', Math.round(calculateItemAnnualCost(exp({ frequency: 'custom', customInterval: 15, customUnit: 'days', nextDueDate: '2026-03-20' }))), 2433);
eq('timeline 2 per month (15 days)', countDueInMonth(exp({ frequency: 'custom', customInterval: 15, customUnit: 'days', nextDueDate: '2026-03-20' }), 2026, 3), 2);
eq('timeline respects endDate', countDueInMonth({ ...m15, endDate: '2026-11-30' }, 2026, 11), 0);
eq('timeline skips paid', countDueInMonth({ ...m15, installments: { '2026-11-15': { status: 'paid' } } }, 2026, 10), 0);
const { run: runHistory } = await import(new URL('./test_dates_history.mjs', import.meta.url).href);
await runHistory({ load, eq, exp });
console.log(`[${process.env.TZ}] test_dates: ${fails ? `${fails} FAILED` : 'all passed'}`);
process.exit(fails ? 1 : 0);
