import { useState, useEffect } from 'react';

export function useExpenseListState(selectedProfileId) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingExp, setEditingExp] = useState(null);
  const [historyModalExp, setHistoryModalExp] = useState(null);
  const [viewMode, setViewMode] = useState('list');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedYearRange, setSelectedYearRange] = useState({
    mode: 'single',
    fromYear: new Date().getFullYear(),
    toYear: new Date().getFullYear(),
  });

  useEffect(() => {
    setSelectedCategory('all');
  }, [selectedProfileId]);

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
