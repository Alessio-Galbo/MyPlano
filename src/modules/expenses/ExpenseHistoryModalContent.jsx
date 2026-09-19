import React from 'react';
import { ExpenseDatabaseTreeSidebar } from './ExpenseDatabaseTreeSidebar';
import { ExpenseDatabaseMainCol } from './ExpenseDatabaseMainCol';
import { ExpenseAttachmentsCol } from './ExpenseAttachmentsCol';

export function ExpenseHistoryModalContent({
  state,
  tree,
  prefs,
  currentExpense,
  onUpdateExpense,
  t,
}) {
  const currentAttachments = currentExpense?.installments?.[state.activeDate]?.attachments || [];

  return (
    <div className={`database-hub-layout mobile-view-${state.mobileStep}`}>
      <ExpenseDatabaseTreeSidebar
        searchQuery={tree.searchQuery}
        onSearchChange={tree.setSearchQuery}
        treeData={tree.treeData}
        expandedYears={tree.expandedYears}
        onToggleYear={tree.toggleYear}
        selectedExpenseId={tree.selectedExpenseId}
        onSelectExpense={(id) => {
          tree.setSelectedExpenseId(id);
          state.setMobileStep('installments');
        }}
        yearSort={prefs.yearSort}
        onToggleYearSort={prefs.toggleYearSort}
        expenseSort={prefs.expenseSort}
        onToggleExpenseSort={prefs.toggleExpenseSort}
        hidePastYears={prefs.hidePastYears}
        onToggleHidePastYears={prefs.toggleHidePastYears}
        t={t}
      />

      <ExpenseDatabaseMainCol
        currentExpense={currentExpense}
        onUpdateExpense={onUpdateExpense}
        installmentSort={prefs.installmentSort}
        onToggleInstallmentSort={prefs.toggleInstallmentSort}
        hidePastInstallments={prefs.hidePastInstallments}
        onToggleHidePastInstallments={prefs.toggleHidePastInstallments}
        activeDate={state.activeDate}
        onSelectInstallmentDate={(d) => {
          state.setActiveDate(d);
          state.setMobileStep('attachments');
        }}
        onRequestDeleteExtra={state.requestDeleteExtra}
        onBackToList={() => state.setMobileStep('tree')}
        t={t}
      />

      <ExpenseAttachmentsCol
        expense={currentExpense}
        dueDate={state.activeDate}
        attachments={currentAttachments}
        onUpdateAttachments={state.updateAttachments}
        onRequestDeleteAttachment={state.requestDeleteAttachment}
        onBackToInstallments={() => state.setMobileStep('installments')}
        t={t}
      />
    </div>
  );
}
