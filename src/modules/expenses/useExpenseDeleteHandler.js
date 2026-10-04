import { useState, useRef, useEffect } from 'react';
import { useToast } from '../../components/ui';
import { useI18n } from '../../core/i18n';
import { storageService } from '../../core/storage';

// Every destructive action shows a toast with "Undo". Undo patches the LATEST stored expense
// (read at click time) so later changes (payments, edits) are kept; a fully deleted expense
// is inserted again (useAppData.saveExpense is an upsert).
export function useExpenseDeleteHandler({ expenses = [], onSaveExpense, onDeleteExpense }) {
  const { t } = useI18n();
  const toast = useToast();
  const [deletingData, setDeletingData] = useState(null);
  // Undo runs later from the toast: always use the latest save function, not a stale closure.
  const saveRef = useRef(onSaveExpense);
  useEffect(() => { saveRef.current = onSaveExpense; }, [onSaveExpense]);

  // Cards pass expanded instances (with dueDate/dueYear): work on the stored original.
  const original = (expense) => expenses.find((e) => e.id === expense?.id) || expense;

  const latest = (id) => storageService.getExpenses().find((e) => e.id === id);

  const notifyWithUndo = (messageKey, title, undo) => {
    toast.show({
      message: t(messageKey).replace('{title}', title || ''),
      variant: 'success',
      action: {
        label: t('common.toast.undo'),
        onClick: () => {
          const restored = undo();
          if (restored) saveRef.current(restored);
          toast.show({ message: t('common.toast.restored'), variant: 'info' });
        },
      },
    });
  };

  const handleRequestDelete = (expense, dueDate) => {
    setDeletingData({ expense, dueDate });
  };

  const handleCloseDelete = () => setDeletingData(null);

  const handleConfirmSingle = (expense, dueDate) => {
    const prev = original(expense);
    const excluded = Array.from(new Set([...(prev.excludedDates || []), dueDate]));
    const wasExcluded = (prev.excludedDates || []).includes(dueDate);
    onSaveExpense({ ...prev, excludedDates: excluded });
    setDeletingData(null);
    notifyWithUndo('common.toast.installmentSkipped', prev.title, () => {
      const cur = latest(prev.id);
      if (!cur || wasExcluded) return null;
      return { ...cur, excludedDates: (cur.excludedDates || []).filter((d) => d !== dueDate) };
    });
  };

  const handleConfirmTerminate = (expense, dueDate) => {
    const prev = original(expense);
    const hadEndDate = Object.prototype.hasOwnProperty.call(prev, 'endDate');
    onSaveExpense({ ...prev, endDate: dueDate });
    setDeletingData(null);
    notifyWithUndo('common.toast.expenseTerminated', prev.title, () => {
      const cur = latest(prev.id);
      if (!cur) return null;
      const { endDate: _dropped, ...rest } = cur;
      return hadEndDate ? { ...rest, endDate: prev.endDate } : rest;
    });
  };

  const handleConfirmDeleteAll = (expenseId) => {
    const prev = original(deletingData?.expense?.id === expenseId ? deletingData.expense : { id: expenseId });
    onDeleteExpense(expenseId);
    setDeletingData(null);
    if (prev?.title !== undefined) notifyWithUndo('common.toast.expenseDeleted', prev.title, () => prev);
  };

  return {
    deletingData,
    handleRequestDelete,
    handleCloseDelete,
    handleConfirmSingle,
    handleConfirmTerminate,
    handleConfirmDeleteAll,
  };
}
