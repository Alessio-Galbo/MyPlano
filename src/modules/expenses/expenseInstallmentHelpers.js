export function advanceDate(dateStr, frequency, interval = 1) {
  const d = new Date(dateStr);
  if (frequency === 'monthly') d.setMonth(d.getMonth() + 1);
  else if (frequency === 'bimonthly') d.setMonth(d.getMonth() + 2);
  else if (frequency === 'quarterly') d.setMonth(d.getMonth() + 3);
  else if (frequency === 'semiannual') d.setMonth(d.getMonth() + 6);
  else if (frequency === 'annual') d.setFullYear(d.getFullYear() + 1);
  else if (frequency === 'biennial') d.setFullYear(d.getFullYear() + 2);
  else if (frequency === 'custom') d.setMonth(d.getMonth() + Math.max(1, Number(interval) || 1));
  return d.toISOString().split('T')[0];
}

export function getInstallmentStatus(expense, dateStr) {
  if (expense.installments?.[dateStr]?.status) {
    return expense.installments[dateStr].status;
  }
  if (expense.status === 'paid' && expense.nextDueDate === dateStr) {
    return 'paid';
  }
  return 'due';
}

export function toggleInstallmentStatus(expense, dateStr) {
  const currentStatus = getInstallmentStatus(expense, dateStr);
  const nextStatus = currentStatus === 'paid' ? 'due' : 'paid';
  const existingInstallments = expense.installments || {};

  const updatedInstallments = {
    ...existingInstallments,
    [dateStr]: {
      ...existingInstallments[dateStr],
      status: nextStatus,
      paidAt: nextStatus === 'paid' ? new Date().toISOString().split('T')[0] : null,
    },
  };

  return {
    ...expense,
    installments: updatedInstallments,
    status: dateStr === expense.nextDueDate ? nextStatus : expense.status,
  };
}

export function getExpenseDatesInYear(expense, targetYear) {
  if (!expense.nextDueDate) return [];
  const baseDate = new Date(expense.nextDueDate);
  const startYear = baseDate.getFullYear();
  if (targetYear < startYear && expense.frequency !== 'oneOff') return [];

  const freq = expense.frequency;
  if (freq === 'oneOff') {
    return startYear === targetYear ? [expense.nextDueDate] : [];
  }

  const results = [];
  const baseMonth = baseDate.getMonth();
  const baseDay = String(baseDate.getDate()).padStart(2, '0');

  if (freq === 'annual') {
    if (targetYear >= startYear) {
      results.push(`${targetYear}-${String(baseMonth + 1).padStart(2, '0')}-${baseDay}`);
    }
  } else if (freq === 'biennial') {
    const diff = targetYear - startYear;
    if (diff >= 0 && diff % 2 === 0) {
      results.push(`${targetYear}-${String(baseMonth + 1).padStart(2, '0')}-${baseDay}`);
    }
  } else {
    let cur = new Date(startYear, baseMonth, baseDate.getDate());
    const endOfYear = new Date(targetYear, 11, 31);
    while (cur <= endOfYear) {
      if (cur.getFullYear() === targetYear) {
        results.push(cur.toISOString().split('T')[0]);
      }
      const nextStr = advanceDate(cur.toISOString().split('T')[0], freq, expense.customInterval);
      cur = new Date(nextStr);
    }
  }
  return results;
}

export function findNextInstallmentDate(expense, currentDueDateStr) {
  if (expense.frequency === 'oneOff' || !currentDueDateStr) return null;
  return advanceDate(currentDueDateStr, expense.frequency, expense.customInterval);
}
