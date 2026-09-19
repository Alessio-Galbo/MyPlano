import React from 'react';
import { ChevronLeft } from 'lucide-react';
import { useI18n } from '../../core/i18n';
import { useFixedExpenseHistory } from './useFixedExpenseHistory';
import { FixedHistoryTopBar } from './FixedHistoryTopBar';
import { FixedExtraPaymentForm } from './FixedExtraPaymentForm';
import { FixedInstallmentsTable } from './FixedInstallmentsTable';
import { FixedInstallmentsHeader } from './FixedInstallmentsHeader';
import './FixedExpenseHistoryView.css';

export function FixedExpenseHistoryView({
  expense,
  onUpdateExpense,
  installmentSort = 'desc',
  onToggleInstallmentSort,
  hidePastInstallments = false,
  onToggleHidePastInstallments,
  activeInstallmentDate,
  onSelectInstallmentDate,
  onRequestDeleteExtra,
  onBackToList,
}) {
  const { t } = useI18n();
  const history = useFixedExpenseHistory({
    expense,
    onUpdateExpense,
    installmentSort,
    hidePastInstallments,
  });
  const activeDate = activeInstallmentDate || history.activeInstallmentDate;

  return (
    <div className="fixed-history-container">
      {onBackToList && (
        <button type="button" className="mobile-col-back-btn" onClick={onBackToList}>
          <ChevronLeft size={16} />
          <span>{t('expenses.databaseHub.backToList')}</span>
        </button>
      )}

      <FixedHistoryTopBar expense={expense} onUpdateExpense={onUpdateExpense} t={t} />

      <div className="fixed-installments-section">
        <FixedInstallmentsHeader
          datesCount={history.dates.length}
          showExtra={history.showExtra}
          onShowExtra={() => history.setShowExtra(true)}
          hidePastInstallments={hidePastInstallments}
          onToggleHidePastInstallments={onToggleHidePastInstallments}
          installmentSort={installmentSort}
          onToggleInstallmentSort={onToggleInstallmentSort}
          t={t}
        />

        {history.showExtra && (
          <FixedExtraPaymentForm
            defaultAmount={expense.amount}
            onSave={history.handleSaveExtra}
            onCancel={() => history.setShowExtra(false)}
          />
        )}

        <FixedInstallmentsTable
          dates={history.dates}
          activeDate={activeDate}
          getDetails={history.getDetails}
          onSelectInstallmentDate={onSelectInstallmentDate}
          onToggleStatus={history.handleToggleStatus}
          onSaveDate={history.handleUpdateInstallmentDate}
          onRequestDeleteExtra={onRequestDeleteExtra}
          t={t}
        />
      </div>
    </div>
  );
}
