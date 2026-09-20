import { calculateBudgetMetrics, getUpcomingDeadlines } from './budgetCalculations';

export function calculateDiscretionaryMargin(income, monthlyQuota) {
  return income > 0 ? Math.round((income - monthlyQuota) * 100) / 100 : 0;
}

export function getBudgetOverviewState({
  profiles,
  expenses,
  documents = [],
  selectedProfileId,
  simulationStrategy,
  coldStart,
}) {
  const profile = profiles.find((p) => p.id === selectedProfileId);
  const isProfileMode = selectedProfileId !== 'all';
  const metrics = calculateBudgetMetrics(expenses, selectedProfileId);
  const upcomingItems = getUpcomingDeadlines(expenses, documents, selectedProfileId);
  const totalLiquidity = profiles.reduce((s, p) => s + (Number(p.initialBalance) || 0), 0);
  const totalIncome = profiles.reduce((s, p) => s + (Number(p.monthlyIncome) || 0), 0);
  const isSurvivalActive = simulationStrategy === 'survival' && coldStart?.hasDeficit;
  const effectiveQuota = isSurvivalActive ? coldStart.catchUpMonthlyQuota : metrics.monthlyQuota;
  const currentIncome = isProfileMode ? (profile?.monthlyIncome || 0) : totalIncome;
  const margin = calculateDiscretionaryMargin(currentIncome, effectiveQuota);

  return {
    profile,
    isProfileMode,
    metrics,
    upcomingItems,
    totalLiquidity,
    totalIncome,
    effectiveQuota,
    currentIncome,
    margin,
  };
}

export function performTopUpFund(profiles, targetId, amount, onUpdateBalance, onSelectStrategy) {
  const target = profiles.find((p) => p.id === targetId);
  if (target) {
    onUpdateBalance?.(targetId, Math.round(((target?.initialBalance || 0) + amount) * 100) / 100);
    onSelectStrategy?.('standard');
  }
}

export function performDepositProfileQuota(profiles, pId, amount, onDepositQuota, onUpdateBalance) {
  if (onDepositQuota) {
    onDepositQuota(pId, amount);
  } else {
    const target = profiles.find((p) => p.id === pId);
    onUpdateBalance?.(pId, Math.round(((Number(target?.initialBalance) || 0) + amount) * 100) / 100);
  }
}
