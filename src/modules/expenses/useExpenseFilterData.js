import { expandExpensesForRange } from './expenseExpansionHelper';

export function useExpenseFilterData(expenses, selectedProfileId, state) {
  const profileExpenses = selectedProfileId === 'all'
    ? expenses
    : expenses.filter((e) => e.profileId === selectedProfileId);

  const expanded = expandExpensesForRange(profileExpenses, state.selectedYearRange);
  const categories = Array.from(new Set(profileExpenses.map((e) => e.category).filter(Boolean)));
  const effectiveCategory = (state.selectedCategory === 'all' || categories.includes(state.selectedCategory))
    ? state.selectedCategory
    : 'all';

  const counts = {
    all: expanded.length,
    ...expanded.reduce((acc, e) => {
      acc[e.category] = (acc[e.category] || 0) + 1;
      return acc;
    }, {}),
  };

  const displayedExpenses = effectiveCategory === 'all'
    ? expanded
    : expanded.filter((e) => e.category === effectiveCategory);

  return {
    categories,
    effectiveCategory,
    counts,
    displayedExpenses,
  };
}
