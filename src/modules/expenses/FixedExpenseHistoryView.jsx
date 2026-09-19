import React from 'react';
import { useI18n } from '../../core/i18n';
import { formatCurrency } from './expenseHelpers';
import { useFixedExpenseHistory } from './useFixedExpenseHistory';
import { FixedNextDueEditor } from './FixedNextDueEditor';
import { FixedInstallmentRow } from './FixedInstallmentRow';
import { FixedExtraPaymentForm } from './FixedExtraPaymentForm';
import './FixedExpenseHistoryView.css';

export function FixedExpenseHistoryView({ expense, onUpdateExpense }) {
  const { t } = useI18n();
  const history = useFixedExpenseHistory({ expense, onUpdateExpense });

  return (
    <div className="fixed-history-container">
      <div className="fixed-history-top-card">
        <div>
          <span className="fixed-history-next-label">{t('expenses.history.nextScheduled')}</span>
          <FixedNextDueEditor
            nextDueDate={expense.nextDueDate}
            onSaveDate={(d) => onUpdateExpense({ ...expense, nextDueDate: d })}
          />
        </div>
        <div className="fixed-history-meta-pill">
          {t('expenses.history.regularAmount')}: <strong>{formatCurrency(expense.amount)}</strong> ({t(`expenses.frequencies.${expense.frequency}`)})
        </div>
      </div>

      <div className="fixed-installments-section">
        <div className="fixed-installments-header">
          <h5 className="fixed-installments-title">{t('expenses.history.installmentsList')} ({history.dates.length})</h5>
          {!history.showExtra && (
            <button type="button" className="fixed-extra-toggle-btn" onClick={() => history.setShowExtra(true)}>
              {t('expenses.history.addExtra')}
            </button>
          )}
        </div>

        {history.showExtra && (
          <FixedExtraPaymentForm
            defaultAmount={expense.amount}
            onSave={history.handleSaveExtra}
            onCancel={() => history.setShowExtra(false)}
          />
        )}

        <div className="payments-table-wrapper">
          <table className="fixed-table">
            <thead>
              <tr>
                <th>{t('expenses.history.date')}</th>
                <th>{t('expenses.history.amount')}</th>
                <th>{t('expenses.history.status')}</th>
                <th>{t('expenses.history.receipt')}</th>
                <th>{t('expenses.history.notes')}</th>
              </tr>
            </thead>
            <tbody>
              {history.dates.map((d) => (
                <FixedInstallmentRow
                  key={d}
                  expense={expense}
                  details={history.getDetails(d)}
                  onToggleStatus={history.handleToggleStatus}
                  onSaveReceipt={history.handleSaveReceipt}
                  onRemoveReceipt={history.handleRemoveReceipt}
                  onDeleteExtra={history.handleDeleteExtra}
                />
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
