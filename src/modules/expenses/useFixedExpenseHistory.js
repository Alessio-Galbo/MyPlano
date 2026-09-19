import { useState, useMemo } from 'react';
import { toggleInstallmentStatus } from './expenseInstallmentHelpers';
import { getAllExpenseInstallmentDates, getInstallmentDetails } from './expenseHistoryHelpers';

export function useFixedExpenseHistory({
  expense,
  onUpdateExpense,
  installmentSort = 'desc',
  hidePastInstallments = false,
}) {
  const [showExtra, setShowExtra] = useState(false);
  const [activeDate, setActiveDate] = useState(null);

  const rawDates = useMemo(() => getAllExpenseInstallmentDates(expense), [expense]);
  const installmentsObj = expense.installments || {};
  const today = new Date().toISOString().split('T')[0];

  const dates = useMemo(() => {
    let list = [...rawDates];
    if (hidePastInstallments) {
      list = list.filter((d) => d >= today);
    }
    return list.sort((a, b) =>
      installmentSort === 'desc' ? b.localeCompare(a) : a.localeCompare(b)
    );
  }, [rawDates, installmentSort, hidePastInstallments, today]);

  const activeInstallmentDate = activeDate && dates.includes(activeDate)
    ? activeDate
    : (dates.includes(expense.nextDueDate) ? expense.nextDueDate : dates[0] || null);

  const handleUpdate = (updatedInst) => onUpdateExpense({ ...expense, installments: updatedInst });
  const handleToggleStatus = (dateStr) => onUpdateExpense(toggleInstallmentStatus(expense, dateStr));

  const handleUpdateAttachments = (dateStr, newAttachments) => {
    const cur = installmentsObj[dateStr] || {};
    handleUpdate({ ...installmentsObj, [dateStr]: { ...cur, attachments: newAttachments } });
  };

  const handleUpdateInstallmentDate = (oldDate, newDate) => {
    if (!newDate || oldDate === newDate) return;
    const oldInst = installmentsObj[oldDate] || {};
    const nextInst = { ...installmentsObj };
    delete nextInst[oldDate];
    nextInst[newDate] = { ...oldInst, date: newDate };

    let nextDue = expense.nextDueDate;
    if (oldDate === expense.nextDueDate || (newDate >= today && (!nextDue || newDate < nextDue || oldDate < today))) {
      nextDue = newDate;
    }
    if (activeDate === oldDate) setActiveDate(newDate);
    onUpdateExpense({ ...expense, nextDueDate: nextDue, installments: nextInst });
  };

  const handleDeleteExtra = (dateStr) => {
    const next = { ...installmentsObj };
    delete next[dateStr];
    handleUpdate(next);
  };

  const handleSaveExtra = (data) => {
    const updated = {
      ...installmentsObj,
      [data.date]: { status: 'paid', amount: data.amount, paidAt: data.date, note: data.note, isExtra: true },
    };
    handleUpdate(updated);
    setShowExtra(false);
    setActiveDate(data.date);
  };

  return {
    showExtra,
    setShowExtra,
    dates,
    activeInstallmentDate,
    setActiveInstallmentDate: setActiveDate,
    handleToggleStatus,
    handleUpdateAttachments,
    handleUpdateInstallmentDate,
    handleDeleteExtra,
    handleSaveExtra,
    getDetails: (d) => getInstallmentDetails(expense, d),
  };
}
