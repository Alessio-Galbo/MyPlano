import React from 'react';
import { Modal, ConfirmModal } from '../../components/ui';
import { useI18n } from '../../core/i18n';
import { useExpenseDatabaseTree } from './useExpenseDatabaseTree';
import { useDatabaseHubPreferences } from './useDatabaseHubPreferences';
import { useExpenseHistoryModalState } from './useExpenseHistoryModalState';
import { ExpenseHistoryModalContent } from './ExpenseHistoryModalContent';
import './ExpenseHistoryModal.css';
import './ExpenseDatabaseHub.css';

export function ExpenseHistoryModal({
  isOpen,
  onClose,
  expense,
  expenses = [],
  onUpdateExpense,
}) {
  const { t } = useI18n();
  const prefs = useDatabaseHubPreferences();
  const tree = useExpenseDatabaseTree({
    expenses: expenses.length > 0 ? expenses : (expense ? [expense] : []),
    initialExpenseId: expense?.id,
    yearSort: prefs.yearSort,
    expenseSort: prefs.expenseSort,
    hidePastYears: prefs.hidePastYears,
  });

  const currentExpense = tree.selectedExpense || expense;
  const state = useExpenseHistoryModalState({ currentExpense, onUpdateExpense, t });

  if (!isOpen) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={t('expenses.databaseHub.title')}
      subtitle={t('expenses.databaseHub.subtitle')}
      className="modal-database-hub"
    >
      <ExpenseHistoryModalContent
        state={state}
        tree={tree}
        prefs={prefs}
        currentExpense={currentExpense}
        onUpdateExpense={onUpdateExpense}
        t={t}
      />

      <ConfirmModal
        isOpen={Boolean(state.confirmData)}
        onClose={state.closeConfirm}
        onConfirm={state.confirmData?.onConfirm || (() => {})}
        title={state.confirmData?.title}
        message={state.confirmData?.message}
      />
    </Modal>
  );
}
