import { useMemo } from 'react';
import { generateCashflowTimeline } from './budgetCalculations';
import { groupTimelineByCategory } from './calculations/timelineGroupingHelper';
import { calculateHorizonTotals } from './calculations/horizonTotalsHelper';

// Data for CashflowTimeline. The simulations are heavy with many expenses: they are
// recomputed only when data or options change, not on every render.
// `simOptions` must be a stable object (memoised by the caller).
export function useCashflowData(expenses, selectedProfileId, horizon, initialBalance, simOptions, selectedCategory) {
  const categories = useMemo(() => {
    const list = selectedProfileId === 'all' ? expenses : expenses.filter((e) => e.profileId === selectedProfileId);
    return Array.from(new Set(list.map((e) => e.category).filter(Boolean)));
  }, [expenses, selectedProfileId]);
  const effectiveCategory = (selectedCategory === 'all' || categories.includes(selectedCategory)) ? selectedCategory : 'all';
  const displayItems = useMemo(() => {
    const opts = { ...simOptions, categoryFilter: effectiveCategory };
    const timeline = generateCashflowTimeline(expenses, selectedProfileId, horizon, initialBalance, opts);
    return groupTimelineByCategory(timeline, effectiveCategory);
  }, [expenses, selectedProfileId, horizon, initialBalance, simOptions, effectiveCategory]);
  const { catMap: horizonCatMap, total: horizonTotal } = useMemo(
    () => calculateHorizonTotals(expenses, selectedProfileId, horizon),
    [expenses, selectedProfileId, horizon],
  );

  return { categories, effectiveCategory, displayItems, horizonCatMap, horizonTotal };
}
