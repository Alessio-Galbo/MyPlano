export function getActiveContractPayments(expense) {
  if (!expense || !expense.paymentHistory || !Array.isArray(expense.paymentHistory)) {
    return [];
  }

  const startDate = expense.contract?.startDate;
  if (!startDate) {
    return expense.paymentHistory;
  }

  const start = String(startDate).slice(0, 10);
  return expense.paymentHistory.filter((p) => !p.date || String(p.date).slice(0, 10) >= start);
}

export function calculateActiveContractAverage(expense) {
  const activePayments = getActiveContractPayments(expense);
  if (activePayments.length === 0) {
    return Number(expense.contract?.estimatedAmount || expense.amount || 0);
  }

  const sum = activePayments.reduce((acc, p) => acc + (Number(p.amount) || 0), 0);
  return Math.round((sum / activePayments.length) * 100) / 100;
}

export function calculateTrendForecastAmount(expense) {
  const activePayments = getActiveContractPayments(expense);
  if (activePayments.length === 0) {
    return Number(expense.contract?.estimatedAmount || expense.amount || 0);
  }
  if (activePayments.length === 1) return Number(activePayments[0].amount || 0);

  const sorted = [...activePayments].sort(
    (a, b) => String(a.date || '').slice(0, 10).localeCompare(String(b.date || '').slice(0, 10))
  );

  let weightedSum = 0;
  let totalWeight = 0;
  sorted.forEach((p, idx) => {
    const weight = idx + 1;
    weightedSum += (Number(p.amount) || 0) * weight;
    totalWeight += weight;
  });
  const weightedAvg = totalWeight > 0 ? weightedSum / totalWeight : 0;
  const last = Number(sorted[sorted.length - 1].amount) || 0;
  const prev = Number(sorted[sorted.length - 2].amount) || 0;
  const delta = prev > 0 ? (last - prev) / prev : 0;
  const clampedDelta = Math.max(-0.25, Math.min(0.25, delta * 0.5));

  return Math.round(weightedAvg * (1 + clampedDelta) * 100) / 100;
}

export function getExpenseEffectiveAmount(expense) {
  if (!expense) return 0;
  if (!expense.isVariable) return Number(expense.amount || 0);
  if (expense.forecastMode === 'trend') return calculateTrendForecastAmount(expense);
  return calculateActiveContractAverage(expense);
}

export function formatExpenseAverageInfo(expense) {
  if (!expense || !expense.isVariable) return null;
  const activePayments = getActiveContractPayments(expense);
  const avg = expense.forecastMode === 'trend'
    ? calculateTrendForecastAmount(expense)
    : calculateActiveContractAverage(expense);
  return {
    isEstimated: activePayments.length === 0,
    paymentsCount: activePayments.length,
    averageAmount: avg,
    contractName: expense.contract?.name || '',
    isTrend: expense.forecastMode === 'trend',
  };
}

