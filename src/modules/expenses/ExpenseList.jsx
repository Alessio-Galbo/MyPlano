import React from 'react';
import { useI18n } from '../../core/i18n';
import { ExpenseListHeader } from './ExpenseListHeader';
import { ExpenseCardGrid } from './ExpenseCardGrid';
import { CategoryGroupedView } from './CategoryGroupedView';
import { ExpenseCategoryFilter } from './ExpenseCategoryFilter';
import { ExpenseYearSelector } from './ExpenseYearSelector';
import { ExpenseModalsContainer } from './ExpenseModalsContainer';
import { useExpenseListState } from './useExpenseListState';
import { useExpenseFilterData } from './useExpenseFilterData';
import { useExpensePaymentHandler } from './useExpensePaymentHandler';
import '../documents/DocumentList.css';

export function ExpenseList({
  expenses,
  profiles,
  selectedProfileId,
  onSaveExpense,
  onDeleteExpense,
  onUpdateProfileBalance,
}) {
  const { t } = useI18n();
  const state = useExpenseListState(selectedProfileId);
  const filterData = useExpenseFilterData(expenses, selectedProfileId, state);
  const paymentHandler = useExpensePaymentHandler({ profiles, onSaveExpense, onUpdateProfileBalance });

  const handleNavigateYear = (targetYear, expId) => {
    state.setSelectedYearRange({ mode: 'single', fromYear: targetYear, toYear: targetYear });
    setTimeout(() => {
      const el = document.querySelector(`[id^="exp-card-${expId}"]`);
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 150);
  };

  const handleToggleProp = (id, prop, val) => {
    const exp = expenses.find((e) => e.id === id);
    if (exp) onSaveExpense({ ...exp, [prop]: val });
  };

  const commonProps = {
    expenses: filterData.displayedExpenses,
    profiles,
    onEdit: (e) => { state.setEditingExp(e); state.setIsModalOpen(true); },
    onDelete: onDeleteExpense,
    onToggleAlert: (id, val) => handleToggleProp(id, 'enableAlert', val),
    onToggleCalendar: (id, val) => handleToggleProp(id, 'includeInCalendar', val),
    onMarkPaid: paymentHandler.handleTogglePaid,
    onNavigateYear: handleNavigateYear,
    onOpenHistory: (e) => state.setHistoryModalExp(e),
  };

  return (
    <div className="doc-list-view">
      <ExpenseListHeader
        viewMode={state.viewMode}
        onToggleViewMode={state.setViewMode}
        onCreate={() => { state.setEditingExp(null); state.setIsModalOpen(true); }}
      />
      <ExpenseYearSelector
        selectedRange={state.selectedYearRange}
        onSelectRange={state.setSelectedYearRange}
      />
      <ExpenseCategoryFilter
        categories={filterData.categories}
        selectedCategory={filterData.effectiveCategory}
        onSelectCategory={state.setSelectedCategory}
        counts={filterData.counts}
      />
      {filterData.displayedExpenses.length === 0 ? (
        <div className="empty-state">{t('expenses.emptyState')}</div>
      ) : state.viewMode === 'grouped' ? (
        <CategoryGroupedView {...commonProps} />
      ) : (
        <ExpenseCardGrid {...commonProps} />
      )}
      <ExpenseModalsContainer
        isFormOpen={state.isModalOpen}
        onCloseForm={() => state.setIsModalOpen(false)}
        onSaveExpense={onSaveExpense}
        editingExp={state.editingExp}
        profiles={profiles}
        expenses={expenses}
        historyExp={state.historyModalExp}
        onCloseHistory={() => state.setHistoryModalExp(null)}
        pendingPayment={paymentHandler.pendingPayment}
        onClosePayment={paymentHandler.handleCloseModal}
        onConfirmPayment={paymentHandler.handleConfirmPayment}
      />
    </div>
  );
}
