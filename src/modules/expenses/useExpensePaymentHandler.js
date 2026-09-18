import { useState } from 'react';
import { getInstallmentStatus } from './expenseInstallmentHelpers';
import { recordInstallmentPayment, revertInstallmentPayment } from './expensePaymentFundHelper';

export function useExpensePaymentHandler({ profiles = [], onSaveExpense, onUpdateProfileBalance }) {
  const [pendingPayment, setPendingPayment] = useState(null);

  const handleTogglePaid = (expense, dueDate) => {
    const isPaid = getInstallmentStatus(expense, dueDate) === 'paid';

    if (isPaid) {
      const { updatedExpense, refundAmount, profileId } = revertInstallmentPayment(expense, dueDate);
      if (refundAmount > 0 && onUpdateProfileBalance) {
        const target = profiles.find((p) => p.id === profileId);
        const cur = Number(target?.initialBalance || 0);
        onUpdateProfileBalance(profileId, Math.round((cur + refundAmount) * 100) / 100);
      }
      onSaveExpense(updatedExpense);
      return;
    }

    setPendingPayment({ expense, dueDate });
  };

  const handleConfirmPayment = (deductFromFund) => {
    if (!pendingPayment) return;
    const { expense, dueDate } = pendingPayment;
    const amount = Number(expense.amount || 0);

    const updated = recordInstallmentPayment(expense, dueDate, { deductFromFund, amount });

    if (deductFromFund && onUpdateProfileBalance && expense.profileId) {
      const target = profiles.find((p) => p.id === expense.profileId);
      const cur = Number(target?.initialBalance || 0);
      onUpdateProfileBalance(expense.profileId, Math.round((cur - amount) * 100) / 100);
    }

    onSaveExpense(updated);
    setPendingPayment(null);
  };

  return {
    pendingPayment,
    handleTogglePaid,
    handleConfirmPayment,
    handleCloseModal: () => setPendingPayment(null),
  };
}
