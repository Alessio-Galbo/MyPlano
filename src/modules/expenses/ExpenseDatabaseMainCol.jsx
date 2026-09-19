import React from 'react';
import { VariableExpenseHistoryView } from './VariableExpenseHistoryView';
import { FixedExpenseHistoryView } from './FixedExpenseHistoryView';

export function ExpenseDatabaseMainCol({
  currentExpense,
  onUpdateExpense,
  installmentSort,
  onToggleInstallmentSort,
  hidePastInstallments,
  onToggleHidePastInstallments,
  activeDate,
  onSelectInstallmentDate,
  onRequestDeleteExtra,
  onBackToList,
  t,
}) {
  if (!currentExpense) {
    return (
      <div className="database-hub-detail-pane">
        <div className="database-hub-empty-detail">
          {t('expenses.databaseHub.noExpensesFound')}
        </div>
      </div>
    );
  }

  return (
    <div className="database-hub-detail-pane">
      {currentExpense.isVariable ? (
        <VariableExpenseHistoryView
          expense={currentExpense}
          onUpdateExpense={onUpdateExpense}
        />
      ) : (
        <FixedExpenseHistoryView
          expense={currentExpense}
          onUpdateExpense={onUpdateExpense}
          installmentSort={installmentSort}
          onToggleInstallmentSort={onToggleInstallmentSort}
          hidePastInstallments={hidePastInstallments}
          onToggleHidePastInstallments={onToggleHidePastInstallments}
          activeInstallmentDate={activeDate}
          onSelectInstallmentDate={onSelectInstallmentDate}
          onRequestDeleteExtra={onRequestDeleteExtra}
          onBackToList={onBackToList}
        />
      )}
    </div>
  );
}
