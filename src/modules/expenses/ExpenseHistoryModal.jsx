import React from 'react';
import { Modal } from '../../components/ui';
import { useI18n } from '../../core/i18n';
import { VariableExpenseHistoryView } from './VariableExpenseHistoryView';
import { FixedExpenseHistoryView } from './FixedExpenseHistoryView';
import './ExpenseHistoryModal.css';

export function ExpenseHistoryModal({ isOpen, onClose, expense, onUpdateExpense }) {
  const { t } = useI18n();

  if (!expense) return null;

  const modalTitle = expense.isVariable
    ? `${expense.title} - ${t('expenses.variable.historyTitle')}`
    : `${expense.title} - ${t('expenses.history.title')}`;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={modalTitle}>
      <div className="expense-history-modal-body">
        {expense.isVariable ? (
          <VariableExpenseHistoryView expense={expense} onUpdateExpense={onUpdateExpense} />
        ) : (
          <FixedExpenseHistoryView expense={expense} onUpdateExpense={onUpdateExpense} />
        )}
      </div>
    </Modal>
  );
}
