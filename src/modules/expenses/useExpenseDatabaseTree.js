import { useState, useMemo, useEffect } from 'react';
import { getAllExpenseInstallmentDates } from './expenseHistoryHelpers';
import { buildExpenseTreeData } from './expenseTreeBuilder';

export function useExpenseDatabaseTree({
  expenses = [],
  initialExpenseId = null,
  yearSort = 'desc',
  expenseSort = 'date',
  hidePastYears = false,
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedExpenseId, setSelectedExpenseId] = useState(initialExpenseId || expenses[0]?.id);
  const [expandedYears, setExpandedYears] = useState(new Set());

  useEffect(() => {
    if (initialExpenseId) {
      setSelectedExpenseId(initialExpenseId);
      const target = expenses.find((e) => e.id === initialExpenseId);
      const year = target?.nextDueDate?.split('-')[0] || new Date().getFullYear().toString();
      setExpandedYears((prev) => new Set([...prev, year]));
    }
  }, [initialExpenseId, expenses]);

  const expenseYearMap = useMemo(() => {
    const map = new Map();
    expenses.forEach((exp) => {
      const dates = getAllExpenseInstallmentDates(exp);
      const yrs = new Set(dates.map((d) => d.split('-')[0]));
      if (exp.nextDueDate) yrs.add(exp.nextDueDate.split('-')[0]);
      map.set(exp.id, { years: Array.from(yrs), dates });
    });
    return map;
  }, [expenses]);

  const treeData = useMemo(() => {
    return buildExpenseTreeData({
      expenses,
      expenseYearMap,
      searchQuery,
      yearSort,
      expenseSort,
      hidePastYears,
    });
  }, [expenses, expenseYearMap, searchQuery, yearSort, expenseSort, hidePastYears]);

  const toggleYear = (yr) => {
    setExpandedYears((prev) => {
      const next = new Set(prev);
      if (next.has(yr)) next.delete(yr);
      else next.add(yr);
      return next;
    });
  };

  const selectedExpense = useMemo(() => {
    return expenses.find((e) => e.id === selectedExpenseId) || expenses[0] || null;
  }, [expenses, selectedExpenseId]);

  return {
    searchQuery,
    setSearchQuery,
    selectedExpenseId,
    setSelectedExpenseId,
    selectedExpense,
    expandedYears,
    toggleYear,
    treeData,
  };
}
