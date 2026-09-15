import React, { useState } from 'react';
import { useI18n } from '../../core/i18n';
import { ExpenseFormModal } from './ExpenseFormModal';
import { ExpenseHistoryModal } from './ExpenseHistoryModal';
import { ExpenseListHeader } from './ExpenseListHeader';
import { ExpenseCardGrid } from './ExpenseCardGrid';
import { CategoryGroupedView } from './CategoryGroupedView';
import { advanceNextDueDate } from './expenseHelpers';
import '../documents/DocumentList.css';

export function ExpenseList({
  expenses,
  profiles,
  selectedProfileId,
  onSaveExpense,
  onDeleteExpense,
}) {
  const { t } = useI18n();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingExp, setEditingExp] = useState(null);
  const [historyModalExp, setHistoryModalExp] = useState(null);
  const [viewMode, setViewMode] = useState('list');

  const filtered = selectedProfileId === 'all'
    ? expenses
    : expenses.filter((e) => e.profileId === selectedProfileId);

  const handleEdit = (exp) => {
    setEditingExp(exp);
    setIsModalOpen(true);
  };

  const handleCreate = () => {
    setEditingExp(null);
    setIsModalOpen(true);
  };

  const handleMarkPaid = (exp) => {
    const nextDate = advanceNextDueDate(exp.nextDueDate, exp.frequency);
    onSaveExpense({ ...exp, nextDueDate: nextDate });
  };

  const handleToggleProp = (id, prop, val) => {
    const exp = expenses.find((e) => e.id === id);
    if (exp) onSaveExpense({ ...exp, [prop]: val });
  };

  const commonProps = {
    expenses: filtered,
    profiles,
    onEdit: handleEdit,
    onDelete: onDeleteExpense,
    onToggleAlert: (id, val) => handleToggleProp(id, 'enableAlert', val),
    onToggleCalendar: (id, val) => handleToggleProp(id, 'includeInCalendar', val),
    onMarkPaid: handleMarkPaid,
    onOpenHistory: (e) => setHistoryModalExp(e),
  };

  return (
    <div className="doc-list-view">
      <ExpenseListHeader
        viewMode={viewMode}
        onToggleViewMode={setViewMode}
        onCreate={handleCreate}
      />

      {filtered.length === 0 ? (
        <div className="empty-state">{t('expenses.emptyState')}</div>
      ) : viewMode === 'grouped' ? (
        <CategoryGroupedView {...commonProps} />
      ) : (
        <ExpenseCardGrid {...commonProps} />
      )}

      <ExpenseFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={onSaveExpense}
        editingExp={editingExp}
        profiles={profiles}
        expenses={expenses}
      />

      <ExpenseHistoryModal
        isOpen={!!historyModalExp}
        onClose={() => setHistoryModalExp(null)}
        expense={historyModalExp}
        onUpdateExpense={(up) => { onSaveExpense(up); setHistoryModalExp(up); }}
      />
    </div>
  );
}
