import React from 'react';
import { FileText } from 'lucide-react';
import { useI18n } from '../../core/i18n';
import { formatExpenseAverageInfo } from './variableExpenseHelpers';
import { formatCurrency } from './expenseHelpers';
import './ExpenseVariableBadge.css';

export function ExpenseVariableBadge({ expense }) {
  const { t } = useI18n();
  const info = formatExpenseAverageInfo(expense);

  if (!info) return null;

  return (
    <div className="expense-variable-indicator">
      <FileText size={12} className="text-primary" />
      <span className="variable-tag">{t('expenses.variable.badgeVariable')}:</span>
      {info.isEstimated ? (
        <span className="text-subtle">
          {t('expenses.variable.initialEstimate')} {formatCurrency(info.averageAmount)}
        </span>
      ) : (
        <span className="text-positive">
          {formatCurrency(info.averageAmount)} (
          {t('expenses.variable.basedOnBills').replace('{count}', info.paymentsCount)})
        </span>
      )}
    </div>
  );
}
