import { useMemo } from 'react';
import { expandExpensesForRange } from './expenseExpansionHelper';

export function useExpenseFilterData(expenses, selectedProfileId, state) {
  // Expansion of recurring expenses is heavy: recompute only when data or range change.
  const profileExpenses = useMemo(() => (selectedProfileId === 'all'
    ? expenses
    : expenses.filter((e) => e.profileId === selectedProfileId)), [expenses, selectedProfileId]);

  const range = state.selectedYearRange;
  const expanded = useMemo(() => expandExpensesForRange(profileExpenses, range), [profileExpenses, range]);
  const categories = useMemo(
    () => Array.from(new Set(profileExpenses.map((e) => e.category).filter(Boolean))),
    [profileExpenses],
  );
  const effectiveCategory = (state.selectedCategory === 'all' || categories.includes(state.selectedCategory))
    ? state.selectedCategory
    : 'all';

  const counts = useMemo(() => ({
    all: expanded.length,
    ...expanded.reduce((acc, e) => {
      acc[e.category] = (acc[e.category] || 0) + 1;
      return acc;
    }, {}),
  }), [expanded]);

  const displayedExpenses = useMemo(() => (effectiveCategory === 'all'
    ? expanded
    : expanded.filter((e) => e.category === effectiveCategory)), [expanded, effectiveCategory]);

  return {
    categories,
    effectiveCategory,
    counts,
    displayedExpenses,
  };
}
