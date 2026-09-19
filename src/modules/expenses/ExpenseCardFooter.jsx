import React from 'react';
import { CheckCircle, Edit2, Trash2, History } from 'lucide-react';
import { Button } from '../../components/ui';
import { useI18n } from '../../core/i18n';

export function ExpenseCardFooter({
  expense,
  dueDate,
  isPaid = false,
  onMarkPaid,
  onEdit,
  onDelete,
  onOpenHistory,
}) {
  const { t } = useI18n();
  const isFromFund = Boolean(expense.installments?.[dueDate]?.deductedFromFund);
  const paidText = isFromFund ? t('expenses.installments.paidFromFund') : t('expenses.installments.paid');

  return (
    <div className="expense-footer">
      <div className="expense-footer-left">
        <Button
          variant={isPaid ? 'success' : 'secondary'}
          size="sm"
          icon={<CheckCircle size={14} />}
          onClick={() => onMarkPaid(expense, dueDate)}
          title={isPaid ? t('expenses.installments.markUnpaid') : t('expenses.installments.markPaid')}
        >
          {isPaid ? paidText : t('expenses.installments.markPaid')}
        </Button>
      </div>

      <div className="doc-actions">
        <button
          type="button"
          className="btn btn-ghost btn-sm"
          title={t('expenses.history.btnTitle')}
          onClick={() => onOpenHistory(expense)}
        >
          <History size={15} />
        </button>
        <button
          type="button"
          className="btn btn-ghost btn-sm"
          title={t('common.actions.edit')}
          onClick={() => onEdit(expense)}
        >
          <Edit2 size={15} />
        </button>
        <button
          type="button"
          className="btn btn-ghost btn-sm"
          title={t('common.actions.delete')}
          onClick={() => onDelete(expense, dueDate)}
        >
          <Trash2 size={15} />
        </button>
      </div>
    </div>
  );
}
