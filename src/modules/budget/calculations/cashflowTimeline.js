import { calculateBudgetMetrics } from './coreMetrics';
import { isExpenseDueInMonth } from './recurrenceHelper';
import { getExpenseEffectiveAmount } from '../../expenses/variableExpenseHelpers';

export function generateCashflowTimeline(
  expenses,
  profileId = 'all',
  horizonMonths = 12,
  initialBalance = 0,
  simOptions = {}
) {
  const filtered = profileId === 'all'
    ? expenses
    : expenses.filter((e) => e.profileId === profileId);

  const { monthlyQuota } = calculateBudgetMetrics(filtered, 'all');
  const months = [];
  const currentDate = new Date();

  const isImm = simOptions.strategy === 'immediate';
  let accumulatedReserve = Number(initialBalance || 0) + (isImm ? Number(simOptions.bufferRequired || 0) : 0);

  for (let i = 0; i < horizonMonths; i++) {
    const targetMonthDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + i, 1);
    const monthIndex = targetMonthDate.getMonth();
    const year = targetMonthDate.getFullYear();

    const dueExpenses = [];
    let excludedOutflow = 0;
    const catFilter = simOptions.categoryFilter;

    const monthOutflow = filtered.reduce((sum, item) => {
      if (isExpenseDueInMonth(item, year, monthIndex)) {
        const amt = getExpenseEffectiveAmount(item);
        if (!catFilter || catFilter === 'all' || item.category === catFilter) {
          dueExpenses.push({ id: item.id, title: item.title, amount: amt, category: item.category });
        } else {
          excludedOutflow += amt;
        }
        return sum + amt;
      }
      return sum;
    }, 0);

    let isSurv = false;
    let appliedQuota = monthlyQuota;
    if (simOptions.strategy === 'survival') {
      if (simOptions.survivalSchedule && simOptions.survivalSchedule[i] !== undefined) {
        appliedQuota = simOptions.survivalSchedule[i];
        isSurv = appliedQuota > monthlyQuota + 0.01;
      } else if (i < (simOptions.survivalMonthsCount || 0)) {
        appliedQuota = Number(simOptions.survivalQuota || monthlyQuota);
        isSurv = true;
      }
    }

    accumulatedReserve += (appliedQuota - monthOutflow);

    const rawShort = targetMonthDate.toLocaleString('default', { month: 'short' });
    const capShort = rawShort.charAt(0).toUpperCase() + rawShort.slice(1);
    const rawLong = targetMonthDate.toLocaleString('default', { month: 'long' });
    const capLong = rawLong.charAt(0).toUpperCase() + rawLong.slice(1);

    months.push({
      date: targetMonthDate,
      monthNameKey: capShort,
      monthLongName: capLong,
      year,
      quota: Math.round(appliedQuota * 100) / 100,
      isSurvivalQuota: isSurv,
      outflow: Math.round(monthOutflow * 100) / 100,
      reserve: Math.round(accumulatedReserve * 100) / 100,
      isShortage: accumulatedReserve < -0.05,
      dueExpenses,
      excludedOutflow: Math.round(excludedOutflow * 100) / 100,
    });
  }

  return months;
}
