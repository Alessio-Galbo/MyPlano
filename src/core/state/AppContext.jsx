import React, { createContext, useContext, useState, useMemo, useCallback, useEffect } from 'react';
import { storageService } from '../storage';
import { DATA_KEYS } from '../storage/storageKeys';
import { usePersistentState } from '../../hooks/usePersistentState';

const AppContext = createContext(null);

const TABS = ['budget', 'documents', 'expenses', 'settings'];
const isValidTab = (v) => TABS.includes(v);
const isValidProfile = (v) => v === 'all' || storageService.getProfiles().some((p) => p.id === v);

export function AppProvider({ children }) {
  const [activeTab, setActiveTab] = usePersistentState('activeTab', 'budget', isValidTab);
  const [defaultProfileId] = useState(() => storageService.getProfiles()[0]?.id || 'all');
  const [selectedProfileId, setSelectedProfileId] = usePersistentState(
    'selectedProfile',
    defaultProfileId,
    isValidProfile,
  );
  const [isGlobalMuted, setIsGlobalMuted] = useState(() => storageService.getGlobalMute());

  const toggleGlobalMute = useCallback(() => {
    setIsGlobalMuted((prev) => {
      const next = !prev;
      storageService.saveGlobalMute(next);
      return next;
    });
  }, []);

  // After import/reset (reloadAll) or a change in another tab, re-read stored preferences.
  const reloadPreferences = useCallback(() => {
    setIsGlobalMuted(storageService.getGlobalMute());
  }, []);

  useEffect(() => {
    const onStorage = (e) => {
      if (e.key === null || e.key === DATA_KEYS.NOTIFICATIONS_MUTED) reloadPreferences();
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, [reloadPreferences]);

  const value = useMemo(() => ({
    activeTab,
    setActiveTab,
    selectedProfileId,
    setSelectedProfileId,
    isGlobalMuted,
    toggleGlobalMute,
    reloadPreferences,
  }), [activeTab, setActiveTab, selectedProfileId, setSelectedProfileId, isGlobalMuted, toggleGlobalMute,
    reloadPreferences]);

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
