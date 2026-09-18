export function recordInstallmentPayment(expense, dateStr, { deductFromFund = false, amount = 0 }) {
  const existingInstallments = expense.installments || {};
  const current = existingInstallments[dateStr] || {};
  const updatedInstallments = {
    ...existingInstallments,
    [dateStr]: {
      ...current,
      status: 'paid',
      paidAt: new Date().toISOString().split('T')[0],
      deductedFromFund: Boolean(deductFromFund),
      deductedAmount: deductFromFund ? Number(amount || expense.amount || 0) : 0,
      profileId: expense.profileId,
    },
  };

  return {
    ...expense,
    installments: updatedInstallments,
    status: dateStr === expense.nextDueDate ? 'paid' : expense.status,
  };
}

export function revertInstallmentPayment(expense, dateStr) {
  const existingInstallments = expense.installments || {};
  const current = existingInstallments[dateStr] || {};
  const refundAmount = current.deductedFromFund ? Number(current.deductedAmount || expense.amount || 0) : 0;
  const profileId = expense.profileId;

  const updatedInstallments = {
    ...existingInstallments,
    [dateStr]: {
      ...current,
      status: 'due',
      paidAt: null,
      deductedFromFund: false,
      deductedAmount: 0,
    },
  };

  const updatedExpense = {
    ...expense,
    installments: updatedInstallments,
    status: dateStr === expense.nextDueDate ? 'due' : expense.status,
  };

  return { updatedExpense, refundAmount, profileId };
}
