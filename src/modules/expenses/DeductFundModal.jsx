import React from 'react';
import { Wallet, CheckCircle, ArrowDownRight } from 'lucide-react';
import { Modal, Button } from '../../components/ui';
import { useI18n } from '../../core/i18n';
import { formatCurrency } from './expenseHelpers';
import { formatDate } from '../documents/documentHelpers';
import './DeductFundModal.css';

export function DeductFundModal({
  isOpen,
  onClose,
  expense,
  dueDate,
  profile,
  onConfirm,
}) {
  const { t } = useI18n();

  if (!expense) return null;

  const effAmount = Number(expense.amount || 0);
  const currentFund = Number(profile?.initialBalance || 0);
  const fundAfter = Math.round((currentFund - effAmount) * 100) / 100;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={t('expenses.installments.deductModalTitle')}>
      <div className="deduct-modal-content">
        <div className="deduct-expense-summary">
          <div className="deduct-summary-header">
            <h4 className="deduct-expense-title">{expense.title}</h4>
            <span className="deduct-expense-amount">{formatCurrency(effAmount)}</span>
          </div>
          <span className="deduct-expense-date">
            {t('expenses.fields.nextDueDate')}: {formatDate(dueDate || expense.nextDueDate)}
          </span>
        </div>

        <p className="deduct-modal-prompt">{t('expenses.installments.deductModalDesc')}</p>

        {profile && (
          <div className="deduct-fund-preview">
            <div className="deduct-fund-row">
              <span className="deduct-fund-label">{t('expenses.installments.currentFundLabel')} ({profile.name}):</span>
              <strong>{formatCurrency(currentFund)}</strong>
            </div>
            <div className="deduct-fund-row after-deduct">
              <span className="deduct-fund-label">
                <ArrowDownRight size={14} className="text-muted" />
                {t('expenses.installments.newFundLabel')}:
              </span>
              <strong className={fundAfter < 0 ? 'val-negative' : 'val-positive'}>
                {formatCurrency(fundAfter)}
              </strong>
            </div>
          </div>
        )}

        <div className="deduct-modal-actions">
          <Button variant="ghost" onClick={onClose}>
            {t('common.actions.cancel')}
          </Button>
          <Button variant="secondary" onClick={() => onConfirm(false)}>
            {t('expenses.installments.btnNoDeduct')}
          </Button>
          <Button variant="primary" icon={<Wallet size={15} />} onClick={() => onConfirm(true)}>
            {t('expenses.installments.btnDeduct')}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
