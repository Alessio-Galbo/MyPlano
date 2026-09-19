import React from 'react';
import { CalendarX, Ban, Trash2 } from 'lucide-react';
import { Modal, Button } from '../../components/ui';
import { useI18n } from '../../core/i18n';
import { formatDate } from '../documents/documentHelpers';
import { formatCurrency } from './expenseHelpers';
import './DeleteExpenseConfirmModal.css';

export function DeleteExpenseConfirmModal({
  isOpen,
  onClose,
  expense,
  dueDate,
  onConfirmSingle,
  onConfirmTerminate,
  onConfirmDeleteAll,
}) {
  const { t } = useI18n();

  if (!expense) return null;

  const effDate = dueDate || expense.nextDueDate;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={t('expenses.deleteModal.title')}>
      <div className="delete-modal-container">
        <div className="delete-expense-banner">
          <div>
            <strong className="delete-banner-title">{expense.title}</strong>
            <span className="delete-banner-sub">
              {formatDate(effDate)} • {formatCurrency(expense.amount)}
            </span>
          </div>
        </div>

        <p className="delete-modal-lead">{t('expenses.deleteModal.prompt')}</p>

        <div className="delete-options-list">
          <button
            type="button"
            className="delete-option-card single"
            onClick={() => { onConfirmSingle(expense, effDate); onClose(); }}
          >
            <div className="delete-option-icon"><CalendarX size={18} /></div>
            <div className="delete-option-text">
              <strong>{t('expenses.deleteModal.singleTitle').replace('{date}', formatDate(effDate))}</strong>
              <p>{t('expenses.deleteModal.singleDesc')}</p>
            </div>
          </button>

          <button
            type="button"
            className="delete-option-card terminate"
            onClick={() => { onConfirmTerminate(expense, effDate); onClose(); }}
          >
            <div className="delete-option-icon"><Ban size={18} /></div>
            <div className="delete-option-text">
              <strong>{t('expenses.deleteModal.terminateTitle')}</strong>
              <p>{t('expenses.deleteModal.terminateDesc')}</p>
            </div>
          </button>

          <button
            type="button"
            className="delete-option-card destroy"
            onClick={() => { onConfirmDeleteAll(expense.id); onClose(); }}
          >
            <div className="delete-option-icon"><Trash2 size={18} /></div>
            <div className="delete-option-text">
              <strong>{t('expenses.deleteModal.destroyTitle')}</strong>
              <p>{t('expenses.deleteModal.destroyDesc')}</p>
            </div>
          </button>
        </div>

        <div className="delete-modal-footer">
          <Button variant="secondary" onClick={onClose}>
            {t('common.actions.cancel')}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
