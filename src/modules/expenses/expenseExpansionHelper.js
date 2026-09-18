import { getExpenseDatesInYear } from './expenseInstallmentHelpers';

export function expandExpensesForRange(expenses, range) {
  if (!range || !Array.isArray(expenses)) return expenses || [];

  let years = [];
  if (range.mode === 'single') {
    years = [range.fromYear];
  } else if (range.mode === 'range') {
    for (let y = range.fromYear; y <= range.toYear; y++) years.push(y);
  } else {
    const baseYears = expenses.map((e) => new Date(e.nextDueDate).getFullYear()).filter(Boolean);
    const min = Math.min(...baseYears, 2026);
    const max = Math.max(...baseYears, 2030);
    for (let y = min; y <= max; y++) years.push(y);
  }

  const items = [];
  expenses.forEach((exp) => {
    years.forEach((year) => {
      const dates = getExpenseDatesInYear(exp, year);
      dates.forEach((dateStr) => {
        items.push({
          ...exp,
          dueDate: dateStr,
          dueYear: year,
        });
      });
    });
  });

  return items.sort((a, b) => (a.dueDate > b.dueDate ? 1 : -1));
}
