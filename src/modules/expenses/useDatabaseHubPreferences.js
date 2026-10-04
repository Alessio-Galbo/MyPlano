import { useState, useEffect } from 'react';
import { UI_KEYS } from '../../core/storage/storageKeys';

const STORAGE_KEY = UI_KEYS.DATABASE_HUB_PREFS;

const DEFAULT_PREFS = {
  yearSort: 'desc',
  expenseSort: 'date',
  installmentSort: 'desc',
  hidePastYears: false,
  hidePastInstallments: false,
};

export function useDatabaseHubPreferences() {
  const [prefs, setPrefs] = useState(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? { ...DEFAULT_PREFS, ...JSON.parse(raw) } : DEFAULT_PREFS;
    } catch {
      return DEFAULT_PREFS;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs));
    } catch {}
  }, [prefs]);

  const toggleYearSort = () => {
    setPrefs((p) => ({ ...p, yearSort: p.yearSort === 'desc' ? 'asc' : 'desc' }));
  };

  const toggleExpenseSort = () => {
    setPrefs((p) => ({ ...p, expenseSort: p.expenseSort === 'date' ? 'alpha' : 'date' }));
  };

  const toggleInstallmentSort = () => {
    setPrefs((p) => ({ ...p, installmentSort: p.installmentSort === 'desc' ? 'asc' : 'desc' }));
  };

  const toggleHidePastYears = () => {
    setPrefs((p) => ({ ...p, hidePastYears: !p.hidePastYears }));
  };

  const toggleHidePastInstallments = () => {
    setPrefs((p) => ({ ...p, hidePastInstallments: !p.hidePastInstallments }));
  };

  return {
    yearSort: prefs.yearSort,
    expenseSort: prefs.expenseSort,
    installmentSort: prefs.installmentSort,
    hidePastYears: prefs.hidePastYears,
    hidePastInstallments: prefs.hidePastInstallments,
    toggleYearSort,
    toggleExpenseSort,
    toggleInstallmentSort,
    toggleHidePastYears,
    toggleHidePastInstallments,
  };
}
