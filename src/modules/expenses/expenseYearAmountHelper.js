import { getInstallmentDetails } from './expenseHistoryHelpers';

export function calculateExpenseYearAmount(exp, dates, year) {
  const inYearDates = (dates || []).filter((d) => d.startsWith(year));
  if (inYearDates.length === 0) return Number(exp.amount || 0);

  return inYearDates.reduce((sum, d) => {
    const details = getInstallmentDetails(exp, d);
    return sum + (Number(details?.amount) || Number(exp.amount) || 0);
  }, 0);
}
