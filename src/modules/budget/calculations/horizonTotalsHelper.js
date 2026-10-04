import { countDueInMonth } from './recurrenceHelper';
import { getExpenseEffectiveAmount } from '../../expenses/variableExpenseHelpers';

export function calculateHorizonTotals(expenses, profileId = 'all', horizonMonths = 12) {
  const filtered = profileId === 'all'
    ? expenses
    : expenses.filter((e) => e.profileId === profileId);

  const currentDate = new Date();
  const catMap = {};
  let total = 0;
  const count = Number(horizonMonths) || 12;

  for (let i = 0; i < count; i++) {
    const targetDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + i, 1);
    const monthIndex = targetDate.getMonth();
    const year = targetDate.getFullYear();

    filtered.forEach((item) => {
      const dueCount = countDueInMonth(item, year, monthIndex);
      if (dueCount > 0) {
        const amt = getExpenseEffectiveAmount(item) * dueCount;
        const cat = item.category || 'other';
        catMap[cat] = (catMap[cat] || 0) + amt;
        total += amt;
      }
    });
  }

  return { catMap, total: Math.round(total * 100) / 100 };
}
