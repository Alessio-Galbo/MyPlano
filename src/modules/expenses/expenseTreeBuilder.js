import { calculateExpenseYearAmount } from './expenseYearAmountHelper';

export function buildExpenseTreeData({
  expenses,
  expenseYearMap,
  searchQuery,
  yearSort,
  expenseSort,
  hidePastYears,
}) {
  const currentYear = new Date().getFullYear().toString();
  const allYearsSet = new Set();
  expenseYearMap.forEach((v) => v.years.forEach((y) => allYearsSet.add(y)));
  let sortedYears = Array.from(allYearsSet).sort((a, b) =>
    yearSort === 'desc' ? Number(b) - Number(a) : Number(a) - Number(b)
  );

  if (hidePastYears) sortedYears = sortedYears.filter((y) => y >= currentYear);

  const q = searchQuery.trim().toLowerCase();

  return sortedYears
    .map((year) => {
      const yearExpenses = expenses
        .filter((exp) => {
          const data = expenseYearMap.get(exp.id);
          if (!data?.years.includes(year)) return false;
          if (!q) return true;
          return exp.title?.toLowerCase().includes(q) || exp.category?.toLowerCase().includes(q);
        })
        .map((exp) => {
          const data = expenseYearMap.get(exp.id);
          return { ...exp, yearAmount: calculateExpenseYearAmount(exp, data?.dates, year) };
        });

      const sortedItems = [...yearExpenses].sort((a, b) => {
        if (expenseSort === 'alpha') return (a.title || '').localeCompare(b.title || '');
        return (a.nextDueDate || '').localeCompare(b.nextDueDate || '');
      });

      return { year, expenses: sortedItems };
    })
    .filter((node) => node.expenses.length > 0);
}
