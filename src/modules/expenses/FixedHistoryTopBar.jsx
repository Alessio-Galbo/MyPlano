import React from 'react';
import { formatCurrency } from './expenseHelpers';
import { FixedNextDueEditor } from './FixedNextDueEditor';

export function FixedHistoryTopBar({ expense, onUpdateExpense, t }) {
  return (
    <div className="fixed-history-top-card">
      <div>
        <span className="fixed-history-next-label">
          {t('expenses.history.nextScheduled')}
        </span>
        <FixedNextDueEditor
          nextDueDate={expense.nextDueDate}
          onSaveDate={(d) => onUpdateExpense({ ...expense, nextDueDate: d })}
        />
      </div>
      <div className="fixed-history-meta-pill">
        {t('expenses.history.regularAmount')}: <strong>{formatCurrency(expense.amount)}</strong> ({t(`expenses.frequencies.${expense.frequency}`)})
      </div>
    </div>
  );
}
