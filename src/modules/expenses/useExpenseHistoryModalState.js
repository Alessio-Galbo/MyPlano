import { useState, useEffect } from 'react';
import { formatDate } from '../documents/documentHelpers';

export function useExpenseHistoryModalState({
  currentExpense,
  onUpdateExpense,
  t,
}) {
  const [activeDate, setActiveDate] = useState(null);
  const [mobileStep, setMobileStep] = useState('installments');
  const [confirmData, setConfirmData] = useState(null);

  useEffect(() => {
    if (currentExpense) {
      setActiveDate(currentExpense.nextDueDate || null);
    }
  }, [currentExpense?.id]);

  const requestDeleteAttachment = (dueDate, att) => {
    setConfirmData({
      title: t('expenses.databaseHub.confirmDeleteAttachmentTitle'),
      message: t('expenses.databaseHub.confirmDeleteAttachmentMsg').replace('{name}', att.name),
      onConfirm: () => {
        const installments = currentExpense.installments || {};
        const cur = installments[dueDate] || {};
        const updatedAtts = (cur.attachments || []).filter((a) => (a.id || a.name) !== (att.id || att.name));
        onUpdateExpense({
          ...currentExpense,
          installments: { ...installments, [dueDate]: { ...cur, attachments: updatedAtts } },
        });
      },
    });
  };

  const requestDeleteExtra = (dateStr) => {
    setConfirmData({
      title: t('expenses.databaseHub.confirmDeleteExtraTitle'),
      message: t('expenses.databaseHub.confirmDeleteExtraMsg').replace('{date}', formatDate(dateStr)),
      onConfirm: () => {
        const next = { ...(currentExpense.installments || {}) };
        delete next[dateStr];
        onUpdateExpense({ ...currentExpense, installments: next });
      },
    });
  };

  const updateAttachments = (dueDate, list) => {
    const installments = currentExpense.installments || {};
    const cur = installments[dueDate] || {};
    onUpdateExpense({
      ...currentExpense,
      installments: { ...installments, [dueDate]: { ...cur, attachments: list } },
    });
  };

  return {
    activeDate,
    setActiveDate,
    mobileStep,
    setMobileStep,
    confirmData,
    closeConfirm: () => setConfirmData(null),
    requestDeleteAttachment,
    requestDeleteExtra,
    updateAttachments,
  };
}
