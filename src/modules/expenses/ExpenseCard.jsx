import React from 'react';
import { Badge, Toggle } from '../../components/ui';
import { useI18n } from '../../core/i18n';
import { formatCurrency, getExpenseUrgency } from './expenseHelpers';
import { formatDate } from '../documents/documentHelpers';
import { ExpenseVariableBadge } from './ExpenseVariableBadge';
import { ExpenseCardFooter } from './ExpenseCardFooter';
import { ExpenseTags } from './ExpenseTags';
import './ExpenseCard.css';

export function ExpenseCard({
  expense,
  profile,
  onEdit,
  onDelete,
  onToggleAlert,
  onToggleCalendar,
  onMarkPaid,
  onOpenHistory,
}) {
  const { t } = useI18n();
  const urgency = getExpenseUrgency(expense.nextDueDate);

  return (
    <div className="expense-card">
      <div className="expense-header">
        <h4 className="expense-title">{expense.title}</h4>
        <Badge variant={urgency.variant}>
          {t(`expenses.status.${urgency.label}`)}
        </Badge>
      </div>

      <ExpenseTags
        profile={profile}
        category={expense.category}
        isVariable={expense.isVariable}
      />

      <div className="expense-amount-row">
        <span className="expense-amount">{formatCurrency(expense.amount)}</span>
        <span className="expense-frequency-badge">
          {t(`expenses.frequencies.${expense.frequency}`)}
        </span>
      </div>

      <ExpenseVariableBadge expense={expense} />

      <div className="expense-meta">
        <div className="doc-meta-row">
          <span className="doc-meta-label">{t('expenses.fields.nextDueDate')}:</span>
          <span className="doc-meta-val">{formatDate(expense.nextDueDate)}</span>
        </div>
      </div>

      <div className="expense-toggles-row">
        <Toggle
          checked={expense.enableAlert}
          onChange={(val) => onToggleAlert(expense.id, val)}
          label={t('expenses.fields.enableAlert')}
          id={`exp-alert-${expense.id}`}
        />
        <Toggle
          checked={expense.includeInCalendar}
          onChange={(val) => onToggleCalendar(expense.id, val)}
          label={t('expenses.fields.includeInCalendar')}
          id={`exp-cal-${expense.id}`}
        />
      </div>

      <ExpenseCardFooter
        expense={expense}
        onMarkPaid={onMarkPaid}
        onEdit={onEdit}
        onDelete={onDelete}
        onOpenHistory={onOpenHistory}
      />
    </div>
  );
}
