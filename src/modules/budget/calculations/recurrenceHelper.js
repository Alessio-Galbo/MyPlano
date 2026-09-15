export function isExpenseDueInMonth(item, targetYear, targetMonthIndex) {
  if (!item.nextDueDate) return false;
  const due = new Date(item.nextDueDate);
  const startYear = due.getFullYear();
  const startMonthIndex = due.getMonth();

  const deltaMonths = (targetYear - startYear) * 12 + (targetMonthIndex - startMonthIndex);
  if (deltaMonths < 0) return false;
  if (deltaMonths === 0) return true;

  switch (item.frequency) {
    case 'monthly':
      return true;
    case 'bimonthly':
      return deltaMonths % 2 === 0;
    case 'quarterly':
      return deltaMonths % 3 === 0;
    case 'semiannual':
      return deltaMonths % 6 === 0;
    case 'annual':
      return deltaMonths % 12 === 0;
    case 'biennial':
      return deltaMonths % 24 === 0;
    case 'custom': {
      const interval = Math.max(1, Number(item.customInterval) || 1);
      return deltaMonths % interval === 0;
    }
    case 'oneOff':
    default:
      return false;
  }
}
