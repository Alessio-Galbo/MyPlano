import React from 'react';
import { CheckCircle, Edit2, Trash2, History } from 'lucide-react';
import { Button } from '../../components/ui';
import { useI18n } from '../../core/i18n';

export function ExpenseCardFooter({
  expense,
  onMarkPaid,
  onEdit,
  onDelete,
  onOpenHistory,
}) {
  const { t } = useI18n();

  return (
    <div className="expense-footer">
      <div className="expense-footer-left">
        <Button
          variant="secondary"
          size="sm"
          icon={<CheckCircle size={14} />}
          onClick={() => onMarkPaid(expense)}
        >
          {t('common.actions.markPaid')}
        </Button>

        {expense.isVariable && (
          <button
            type="button"
            className="btn btn-ghost btn-sm"
            title={t('expenses.variable.historyBtn')}
            onClick={() => onOpenHistory(expense)}
          >
            <History size={15} />
          </button>
        )}
      </div>

      <div className="doc-actions">
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
          onClick={() => onDelete(expense.id)}
        >
          <Trash2 size={15} />
        </button>
      </div>
    </div>
  );
}
