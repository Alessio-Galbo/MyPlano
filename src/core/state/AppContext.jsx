import React, { createContext, useContext, useState } from 'react';
import { storageService } from '../storage';

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [activeTab, setActiveTab] = useState('budget'); // 'budget', 'documents', 'expenses', 'settings'
  const [selectedProfileId, setSelectedProfileId] = useState('all'); // 'all' or profile.id
  const [isGlobalMuted, setIsGlobalMuted] = useState(() => storageService.getGlobalMute());

  const toggleGlobalMute = () => {
    setIsGlobalMuted((prev) => {
      const next = !prev;
      storageService.saveGlobalMute(next);
      return next;
    });
  };

  const value = {
    activeTab,
    setActiveTab,
    selectedProfileId,
    setSelectedProfileId,
    isGlobalMuted,
    toggleGlobalMute,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
