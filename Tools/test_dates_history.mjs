// History backfill + installment-key audit cases, run by Tools/test_dates.mjs (do not run alone).
export async function run({ load, eq, exp }) {
  const inst = await load('modules/expenses/expenseInstallmentHelpers.js');
  const { getAllExpenseInstallmentDates } = await load('modules/expenses/expenseHistoryHelpers.js');
  const { countDueInMonth } = await load('modules/budget/calculations/recurrenceHelper.js');
  const { getOccurrences } = await load('core/dates/recurrence.js');
  const audit = await load('core/dates/installmentKeyAudit.js');
  const months = (y, from, to) => Array.from({ length: to - from + 1 },
    (_, i) => `${y}-${String(from + i).padStart(2, '0')}-15`);

  // Real data: no startDate, nextDueDate moved forward.
  const n15 = exp({ frequency: 'monthly', nextDueDate: '2026-11-15' });
  const hist = (e, y) => getAllExpenseInstallmentDates(e).filter((d) => d.startsWith(y)).sort();
  eq('history without startDate/installments: from nextDueDate', hist(n15, '2026'), months(2026, 11, 12));
  const mar = { ...n15, installments: { '2026-03-15': { status: 'paid' } } };
  eq('history with installment 2026-03-15: from March', hist(mar, '2026'), months(2026, 3, 12));
  eq('budget/default: no backfill', getOccurrences(n15, '2026-10-01', '2026-10-31'), []);
  eq('cashflow: past rates not due', countDueInMonth(n15, 2026, 9), 0);
  eq('startDate wins over backfill', hist({ ...n15, startDate: '2026-09-15' }, '2026'), months(2026, 9, 12));
  const old = { ...n15, installments: { '2025-03-15': { status: 'paid' } } };
  eq('year view backfills to oldest installment', inst.getExpenseDatesInYear(old, 2025), months(2025, 3, 12));
  eq('year view without installments: no backfill', inst.getExpenseDatesInYear(n15, 2026), months(2026, 11, 12));
  const far = { ...n15, installments: { '2001-01-15': { status: 'paid' } } };
  eq('backfill capped at 10 years', inst.getExpenseDatesInYear(far, 2010), []);
  eq('backfill 10y limit reached', inst.getExpenseDatesInYear(far, 2016)[0], '2016-11-15');

  const shifted = { ...n15, title: 'S', installments: { '2026-10-14': { status: 'paid' } } };
  eq('audit without startDate', audit.findShiftedInstallmentKeys([shifted]),
    [{ expenseId: 'e', title: 'S', fromKey: '2026-10-14', toKey: '2026-10-15' }]);
  eq('audit finds 2-day shift', audit.findShiftedInstallmentKeys([{ ...n15, title: 'S', installments: { '2027-04-13': {} } }]),
    [{ expenseId: 'e', title: 'S', fromKey: '2027-04-13', toKey: '2027-04-15' }]);
  eq('audit ignores custom days', audit.findShiftedInstallmentKeys([exp({ frequency: 'custom', customInterval: 15,
    customUnit: 'days', nextDueDate: '2026-10-15', installments: { '2026-10-29': {} } })]), []);
  const m15 = exp({ frequency: 'monthly', nextDueDate: '2026-10-15' });
  const bad = { ...m15, title: 'T', installments: { '2027-01-14': { status: 'paid', attachments: ['a'] },
    '2027-02-14': { status: 'paid' }, '2027-02-15': { status: 'paid' }, '2027-03-03': { isExtra: true } } };
  const fixes = audit.findShiftedInstallmentKeys([bad]);
  eq('audit finds only fixable keys', fixes, [{ expenseId: 'e', title: 'T', fromKey: '2027-01-14', toKey: '2027-01-15' }]);
  const fixed = audit.applyInstallmentKeyFixes([bad], [...fixes, { expenseId: 'e', fromKey: '2027-02-14', toKey: '2027-02-15' }]);
  eq('audit apply moves data, keeps existing', Object.keys(fixed[0].installments).sort(),
    ['2027-01-15', '2027-02-14', '2027-02-15', '2027-03-03']);
  eq('audit apply attachments + immutability',
    [fixed[0].installments['2027-01-15'].attachments, !!bad.installments['2027-01-14']], [['a'], true]);
}
