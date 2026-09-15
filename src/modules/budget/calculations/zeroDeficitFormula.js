import { generateCashflowTimeline } from './cashflowTimeline';
import { calculateBudgetMetrics } from './coreMetrics';

export function calculateZeroDeficitQuota(
  expenses,
  profileId = 'all',
  horizonMonths = 12,
  initialBalance = 0
) {
  const { monthlyQuota: steadyQuota } = calculateBudgetMetrics(expenses, profileId);
  const timeline = generateCashflowTimeline(expenses, profileId, horizonMonths, initialBalance);

  let cumulativeOutflow = 0;
  let maxRequiredQuota = 0;
  let criticalMonthIndex = 0;

  for (let t = 1; t <= timeline.length; t++) {
    const month = timeline[t - 1];
    cumulativeOutflow += month.outflow;

    const netNeeded = Math.max(0, cumulativeOutflow - initialBalance);
    const requiredQuotaAtT = netNeeded / t;

    if (requiredQuotaAtT > maxRequiredQuota) {
      maxRequiredQuota = requiredQuotaAtT;
      criticalMonthIndex = t;
    }
  }

  const safeMonthlyQuota = Math.round(
    Math.max(steadyQuota, maxRequiredQuota) * 100
  ) / 100;

  const isSurgeNeeded = maxRequiredQuota > steadyQuota;

  return {
    steadyQuota: Math.round(steadyQuota * 100) / 100,
    safeMonthlyQuota,
    isSurgeNeeded,
    criticalMonthIndex,
    catchUpMonths: criticalMonthIndex,
  };
}
