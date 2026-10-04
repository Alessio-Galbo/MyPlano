import React from 'react';
import { ExpenseListHeader } from './ExpenseListHeader';
import { ExpenseListBody } from './ExpenseListBody';
import { ExpenseModalsContainer } from './ExpenseModalsContainer';
import { useExpenseListState } from './useExpenseListState';
import { useExpenseFilterData } from './useExpenseFilterData';
import { useExpensePaymentHandler } from './useExpensePaymentHandler';
import { useExpenseDeleteHandler } from './useExpenseDeleteHandler';
import { FirstProfileGuide } from '../../components/onboarding';
import '../documents/DocumentList.css';

export function ExpenseList({
  expenses, profiles, selectedProfileId, onSaveExpense, onDeleteExpense, onUpdateProfileBalance, onAdjustProfileBalance,
}) {
  const state = useExpenseListState(selectedProfileId);
  const filterData = useExpenseFilterData(expenses, selectedProfileId, state);
  const paymentHandler = useExpensePaymentHandler({ profiles, onSaveExpense, onUpdateProfileBalance, onAdjustProfileBalance });
  const deleteHandler = useExpenseDeleteHandler({ expenses, onSaveExpense, onDeleteExpense });

  const handleNavigateYear = (targetYear, expId) => {
    const sec = document.getElementById(`year-section-${targetYear}`);
    if (sec) return sec.scrollIntoView({ behavior: 'smooth', block: 'start' });
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
    onDelete: deleteHandler.handleRequestDelete,
    onToggleAlert: (id, val) => handleToggleProp(id, 'enableAlert', val),
    onToggleCalendar: (id, val) => handleToggleProp(id, 'includeInCalendar', val),
    onMarkPaid: paymentHandler.handleTogglePaid,
    onNavigateYear: handleNavigateYear,
    onOpenHistory: (e) => state.setHistoryModalExp(e),
  };

  const handleCreate = () => { state.setEditingExp(null); state.setIsModalOpen(true); };
  const noProfiles = !profiles?.length;

  return (
    <div className="doc-list-view">
      <ExpenseListHeader
        viewMode={state.viewMode} onToggleViewMode={state.setViewMode} onCreate={handleCreate} disabled={noProfiles}
      />
      {noProfiles ? <FirstProfileGuide /> : (
        <ExpenseListBody
          state={state} filterData={filterData} commonProps={commonProps} expenses={expenses}
          profiles={profiles} selectedProfileId={selectedProfileId} onCreate={handleCreate}
        />
      )}
      <ExpenseModalsContainer
        isFormOpen={state.isModalOpen} onCloseForm={() => state.setIsModalOpen(false)}
        onSaveExpense={onSaveExpense} editingExp={state.editingExp}
        profiles={profiles} expenses={expenses}
        historyExp={state.historyModalExp} onCloseHistory={() => state.setHistoryModalExp(null)}
        pendingPayment={paymentHandler.pendingPayment}
        onClosePayment={paymentHandler.handleCloseModal}
        onConfirmPayment={paymentHandler.handleConfirmPayment}
        deletingData={deleteHandler.deletingData}
        onCloseDelete={deleteHandler.handleCloseDelete}
        onConfirmSingle={deleteHandler.handleConfirmSingle}
        onConfirmTerminate={deleteHandler.handleConfirmTerminate}
        onConfirmDeleteAll={deleteHandler.handleConfirmDeleteAll}
      />
    </div>
  );
}
