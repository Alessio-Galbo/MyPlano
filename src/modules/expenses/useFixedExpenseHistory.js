import { useState } from 'react';
import { toggleInstallmentStatus } from './expenseInstallmentHelpers';
import { getAllExpenseInstallmentDates, getInstallmentDetails } from './expenseHistoryHelpers';

export function useFixedExpenseHistory({ expense, onUpdateExpense }) {
  const [showExtra, setShowExtra] = useState(false);

  const dates = getAllExpenseInstallmentDates(expense);
  const installmentsObj = expense.installments || {};

  const handleUpdate = (updatedInst) => onUpdateExpense({ ...expense, installments: updatedInst });

  const handleToggleStatus = (dateStr) => onUpdateExpense(toggleInstallmentStatus(expense, dateStr));

  const handleSaveReceipt = (dateStr, rec) => {
    const cur = installmentsObj[dateStr] || {};
    handleUpdate({ ...installmentsObj, [dateStr]: { ...cur, receipt: rec } });
  };

  const handleRemoveReceipt = (dateStr) => {
    const cur = installmentsObj[dateStr] || {};
    const { receipt, ...rest } = cur;
    handleUpdate({ ...installmentsObj, [dateStr]: rest });
  };

  const handleDeleteExtra = (dateStr) => {
    const next = { ...installmentsObj };
    delete next[dateStr];
    handleUpdate(next);
  };

  const handleSaveExtra = (data) => {
    const updated = {
      ...installmentsObj,
      [data.date]: { status: 'paid', amount: data.amount, paidAt: data.date, note: data.note, isExtra: true },
    };
    handleUpdate(updated);
    setShowExtra(false);
  };

  return {
    showExtra,
    setShowExtra,
    dates,
    handleToggleStatus,
    handleSaveReceipt,
    handleRemoveReceipt,
    handleDeleteExtra,
    handleSaveExtra,
    getDetails: (d) => getInstallmentDetails(expense, d),
  };
}
