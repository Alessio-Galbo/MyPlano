export function isExpenseDueInMonth(item, targetYear, targetMonthIndex) {
  if (!item.nextDueDate) return false;
  const due = new Date(item.nextDueDate);
  const startYear = due.getFullYear();
  const startMonthIndex = due.getMonth();

  const deltaMonths = (targetYear - startYear) * 12 + (targetMonthIndex - startMonthIndex);
  if (deltaMonths < 0) return false;

  const dateStr = `${targetYear}-${String(targetMonthIndex + 1).padStart(2, '0')}-${String(due.getDate()).padStart(2, '0')}`;
  const isPaid = item.installments?.[dateStr]?.status === 'paid' || (deltaMonths === 0 && item.status === 'paid');

  if (deltaMonths === 0) return !isPaid;

  let isDueByFreq = false;
  switch (item.frequency) {
    case 'monthly': isDueByFreq = true; break;
    case 'bimonthly': isDueByFreq = deltaMonths % 2 === 0; break;
    case 'quarterly': isDueByFreq = deltaMonths % 3 === 0; break;
    case 'semiannual': isDueByFreq = deltaMonths % 6 === 0; break;
    case 'annual': isDueByFreq = deltaMonths % 12 === 0; break;
    case 'biennial': isDueByFreq = deltaMonths % 24 === 0; break;
    case 'custom': {
      const interval = Math.max(1, Number(item.customInterval) || 1);
      isDueByFreq = deltaMonths % interval === 0;
      break;
    }
    case 'oneOff':
    default: isDueByFreq = false; break;
  }

  return isDueByFreq && !isPaid;
}

