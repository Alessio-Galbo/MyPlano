import { useState } from 'react';
import { getInstallmentStatus } from './expenseInstallmentHelpers';
import { recordInstallmentPayment, revertInstallmentPayment } from './expensePaymentFundHelper';

const round2 = (n) => Math.round(n * 100) / 100;

// Fund changes are applied as deltas on the latest balance (never on the
// `profiles` of this render), so quick consecutive payments are all counted.
export function useExpensePaymentHandler({ onSaveExpense, onUpdateProfileBalance, onAdjustProfileBalance }) {
  const [pendingPayment, setPendingPayment] = useState(null);

  const adjustFund = (profileId, delta) => {
    if (!profileId || !delta) return;
    if (onAdjustProfileBalance) onAdjustProfileBalance(profileId, delta);
    else onUpdateProfileBalance?.(profileId, (cur) => round2(cur + delta));
  };

  const handleTogglePaid = (expense, dueDate) => {
    const isPaid = getInstallmentStatus(expense, dueDate) === 'paid';

    if (isPaid) {
      const { updatedExpense, refundAmount, profileId } = revertInstallmentPayment(expense, dueDate);
      if (refundAmount > 0) adjustFund(profileId, refundAmount);
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
    if (deductFromFund) adjustFund(expense.profileId, -amount);

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
