import { useState, useCallback } from 'react';
import { usePersistentState } from '../../hooks/usePersistentState';

const THIS_YEAR = new Date().getFullYear();
const DEFAULT_RANGE = { mode: 'single', fromYear: THIS_YEAR, toYear: THIS_YEAR };

const isPlainObject = (v) => Boolean(v) && typeof v === 'object' && !Array.isArray(v);
const isValidRange = (v) => isPlainObject(v)
  && ['single', 'range', 'all'].includes(v.mode)
  && Number.isInteger(v.fromYear) && Number.isInteger(v.toYear);

export function useExpenseListState(selectedProfileId) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingExp, setEditingExp] = useState(null);
  const [historyModalExp, setHistoryModalExp] = useState(null);
  const [viewMode, setViewMode] = usePersistentState(
    'expenses.viewMode',
    'list',
    (v) => v === 'list' || v === 'grouped',
  );
  // Category filter is remembered per profile: { [profileId]: category }.
  const [categoryByProfile, setCategoryByProfile] = usePersistentState(
    'expenses.categoryByProfile',
    {},
    isPlainObject,
  );
  const [selectedYearRange, setSelectedYearRange] = usePersistentState(
    'expenses.yearRange',
    DEFAULT_RANGE,
    isValidRange,
  );

  const selectedCategory = categoryByProfile[selectedProfileId] || 'all';
  const setSelectedCategory = useCallback((cat) => {
    setCategoryByProfile((prev) => ({ ...prev, [selectedProfileId]: cat }));
  }, [selectedProfileId, setCategoryByProfile]);

  return {
    isModalOpen,
    setIsModalOpen,
    editingExp,
    setEditingExp,
    historyModalExp,
    setHistoryModalExp,
    viewMode,
    setViewMode,
    selectedCategory,
    setSelectedCategory,
    selectedYearRange,
    setSelectedYearRange,
  };
}
