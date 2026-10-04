import React from 'react';
import { Badge, Toggle } from '../../components/ui';
import { useI18n } from '../../core/i18n';
import { formatCurrency, getExpenseUrgency, getExpenseBadgeInfo } from './expenseHelpers';
import { getInstallmentStatus, findNextInstallmentDate } from './expenseInstallmentHelpers';
import { formatDate } from '../documents/documentHelpers';
import { ExpenseVariableBadge } from './ExpenseVariableBadge';
import { ExpenseCardFooter } from './ExpenseCardFooter';
import { ExpenseTags } from './ExpenseTags';
import './ExpenseCard.css';

export function ExpenseCard({
  expense, profile, dueDate, onEdit, onDelete,
  onToggleAlert, onToggleCalendar, onMarkPaid, onOpenHistory, onNavigateYear,
}) {
  const { t } = useI18n();
  const effDate = dueDate || expense.nextDueDate;
  const isPaid = getInstallmentStatus(expense, effDate) === 'paid';
  const urgency = isPaid ? { variant: 'success', label: 'paid' } : getExpenseUrgency(effDate);
  const isFromFund = Boolean(expense.installments?.[effDate]?.deductedFromFund);
  const badgeInfo = getExpenseBadgeInfo(isPaid, isFromFund, urgency, t);

  const nextDate = findNextInstallmentDate(expense, effDate);
  const nextY = nextDate ? Number(nextDate.slice(0, 4)) : null;
  const curY = effDate ? Number(String(effDate).slice(0, 4)) : null;
  const showNext = nextY && nextY !== curY && onNavigateYear;

  return (
    <div className={`expense-card ${isPaid ? 'expense-card-paid' : ''}`} id={`exp-card-${expense.id}-${effDate}`}>
      <div className="expense-header">
        <h4 className="expense-title">{expense.title}</h4>
        <Badge variant={badgeInfo.variant}>
          {badgeInfo.label}
        </Badge>
      </div>

      <ExpenseTags profile={profile} category={expense.category} isVariable={expense.isVariable} />

      <div className="expense-amount-row">
        <span className="expense-amount">{formatCurrency(expense.amount)}</span>
        <span className="expense-frequency-badge">{t(`expenses.frequencies.${expense.frequency}`)}</span>
      </div>

      <ExpenseVariableBadge expense={expense} />

      <div className="expense-meta">
        <div className="doc-meta-row">
          <span className="doc-meta-label">{t('expenses.fields.dueDate')}:</span>
          <span className="doc-meta-val">{formatDate(effDate)}</span>
        </div>
        {showNext && (
          <div className="doc-meta-row next-installment-row">
            <span className="doc-meta-label">{t('expenses.installments.nextOccurrence')}:</span>
            <button
              type="button"
              className="next-installment-jump-btn"
              onClick={() => onNavigateYear(nextY, expense.id)}
            >
              {formatDate(nextDate)} ({t('expenses.installments.jumpToNext').replace('{year}', nextY)})
            </button>
          </div>
        )}
      </div>

      <div className="expense-toggles-row">
        <Toggle
          checked={expense.enableAlert !== false} onChange={(val) => onToggleAlert(expense.id, val)}
          label={t('expenses.fields.enableAlert')} id={`exp-alert-${expense.id}-${effDate}`}
        />
        <Toggle
          checked={expense.includeInCalendar} onChange={(val) => onToggleCalendar(expense.id, val)}
          label={t('expenses.fields.includeInCalendar')} id={`exp-cal-${expense.id}-${effDate}`}
        />
      </div>

      <ExpenseCardFooter
        expense={expense} dueDate={effDate} isPaid={isPaid}
        onMarkPaid={onMarkPaid} onEdit={onEdit} onDelete={onDelete} onOpenHistory={onOpenHistory}
      />
    </div>
  );
}

