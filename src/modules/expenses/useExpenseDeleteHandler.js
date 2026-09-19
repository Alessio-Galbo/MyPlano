import { useState } from 'react';

export function useExpenseDeleteHandler({ onSaveExpense, onDeleteExpense }) {
  const [deletingData, setDeletingData] = useState(null);

  const handleRequestDelete = (expense, dueDate) => {
    setDeletingData({ expense, dueDate });
  };

  const handleCloseDelete = () => setDeletingData(null);

  const handleConfirmSingle = (expense, dueDate) => {
    const excluded = Array.from(new Set([...(expense.excludedDates || []), dueDate]));
    onSaveExpense({ ...expense, excludedDates: excluded });
    setDeletingData(null);
  };

  const handleConfirmTerminate = (expense, dueDate) => {
    onSaveExpense({ ...expense, endDate: dueDate });
    setDeletingData(null);
  };

  const handleConfirmDeleteAll = (expenseId) => {
    onDeleteExpense(expenseId);
    setDeletingData(null);
  };

  return {
    deletingData,
    handleRequestDelete,
    handleCloseDelete,
    handleConfirmSingle,
    handleConfirmTerminate,
    handleConfirmDeleteAll,
  };
}
