import React from 'react';
import { ExpenseFormModal } from './ExpenseFormModal';
import { ExpenseHistoryModal } from './ExpenseHistoryModal';
import { DeductFundModal } from './DeductFundModal';
import { DeleteExpenseConfirmModal } from './DeleteExpenseConfirmModal';

export function ExpenseModalsContainer({
  isFormOpen,
  onCloseForm,
  onSaveExpense,
  editingExp,
  profiles = [],
  expenses = [],
  historyExp,
  onCloseHistory,
  pendingPayment,
  onClosePayment,
  onConfirmPayment,
  deletingData,
  onCloseDelete,
  onConfirmSingle,
  onConfirmTerminate,
  onConfirmDeleteAll,
}) {
  const pendingProfile = pendingPayment?.expense?.profileId
    ? profiles.find((p) => p.id === pendingPayment.expense.profileId)
    : null;

  return (
    <>
      <ExpenseFormModal
        isOpen={isFormOpen}
        onClose={onCloseForm}
        onSave={onSaveExpense}
        editingExp={editingExp}
        profiles={profiles}
        expenses={expenses}
      />

      <ExpenseHistoryModal
        isOpen={Boolean(historyExp)}
        onClose={onCloseHistory}
        expense={historyExp}
        onUpdateExpense={(up) => onSaveExpense(up)}
      />

      <DeductFundModal
        isOpen={Boolean(pendingPayment)}
        onClose={onClosePayment}
        expense={pendingPayment?.expense}
        dueDate={pendingPayment?.dueDate}
        profile={pendingProfile}
        onConfirm={onConfirmPayment}
      />

      <DeleteExpenseConfirmModal
        isOpen={Boolean(deletingData)}
        onClose={onCloseDelete}
        expense={deletingData?.expense}
        dueDate={deletingData?.dueDate}
        onConfirmSingle={onConfirmSingle}
        onConfirmTerminate={onConfirmTerminate}
        onConfirmDeleteAll={onConfirmDeleteAll}
      />
    </>
  );
}
