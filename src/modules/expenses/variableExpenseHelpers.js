export function getActiveContractPayments(expense) {
  if (!expense || !expense.paymentHistory || !Array.isArray(expense.paymentHistory)) {
    return [];
  }

  const startDate = expense.contract?.startDate;
  if (!startDate) {
    return expense.paymentHistory;
  }

  const startTimestamp = new Date(startDate).setHours(0, 0, 0, 0);
  return expense.paymentHistory.filter((p) => {
    if (!p.date) return true;
    const pTime = new Date(p.date).setHours(0, 0, 0, 0);
    return pTime >= startTimestamp;
  });
}

export function calculateActiveContractAverage(expense) {
  const activePayments = getActiveContractPayments(expense);
  if (activePayments.length === 0) {
    return Number(expense.contract?.estimatedAmount || expense.amount || 0);
  }

  const sum = activePayments.reduce((acc, p) => acc + (Number(p.amount) || 0), 0);
  return Math.round((sum / activePayments.length) * 100) / 100;
}

export function getExpenseEffectiveAmount(expense) {
  if (!expense) return 0;
  if (!expense.isVariable) {
    return Number(expense.amount || 0);
  }
  return calculateActiveContractAverage(expense);
}

export function formatExpenseAverageInfo(expense) {
  if (!expense || !expense.isVariable) return null;
  const activePayments = getActiveContractPayments(expense);
  const avg = calculateActiveContractAverage(expense);
  return {
    isEstimated: activePayments.length === 0,
    paymentsCount: activePayments.length,
    averageAmount: avg,
    contractName: expense.contract?.name || '',
  };
}
