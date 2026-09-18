import { generateCashflowTimeline } from './cashflowTimeline';
import { computeAdaptiveSurvivalPhases } from './survivalPhasesHelper';

export function calculateColdStartAnalysis(expenses, profileId = 'all', initialBalance = 0) {
  const timeline = generateCashflowTimeline(expenses, profileId, 12, initialBalance);
  const baselineTimeline = generateCashflowTimeline(expenses, profileId, 12, 0);

  let minReserve = timeline.length > 0 ? timeline[0].reserve : initialBalance;
  let worstMonth = timeline.length > 0 ? { ...timeline[0], monthIndex: 1 } : null;
  let firstDeficitMonth = null;
  let cumulativeOutflow = 0;

  for (let i = 0; i < timeline.length; i++) {
    const m = timeline[i];
    cumulativeOutflow += m.outflow;

    if (m.reserve <= minReserve) {
      minReserve = m.reserve;
      worstMonth = { ...m, monthIndex: i + 1 };
    }

    if (m.isShortage && !firstDeficitMonth) {
      firstDeficitMonth = { ...m, monthIndex: i + 1, cumulativeOutflow };
    }
  }

  let baselineMin = 0;
  for (const m of baselineTimeline) {
    if (m.reserve < baselineMin) baselineMin = m.reserve;
  }

  const hasDeficit = minReserve < -0.05;
  const maxDeficit = hasDeficit ? Math.abs(minReserve) : 0;
  const theoreticalBufferNeeded = baselineMin < -0.05 ? Math.abs(baselineMin) : 0;
  const safetyMargin = minReserve >= -0.05 ? Math.max(0, Math.round(minReserve * 100) / 100) : 0;
  const stdQuota = timeline.length > 0 ? timeline[0].quota : 0;

  const { phases, quotas: survivalSchedule } = computeAdaptiveSurvivalPhases(
    timeline,
    stdQuota,
    initialBalance
  );

  return {
    initialBalance,
    hasDeficit,
    minReserve: Math.round(minReserve * 100) / 100,
    safetyMargin,
    maxDeficit: Math.round(maxDeficit * 100) / 100,
    initialBufferRequired: Math.round(maxDeficit * 100) / 100,
    theoreticalBufferNeeded: Math.round(theoreticalBufferNeeded * 100) / 100,
    worstMonth,
    firstDeficitMonth,
    phases,
    survivalSchedule,
    catchUpMonthlyQuota: phases.length > 0 ? phases[0].quota : stdQuota,
    survivalMonthsCount: phases.length > 0 ? phases[phases.length - 1].toMonthIndex : 1,
  };
}
