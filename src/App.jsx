import React, { useState, useEffect } from 'react';
import { Navbar, TabContent } from './components/layout';
import { ProfileModalsContainer, ProfileManagementModal } from './modules/profiles';
import { useApp, useAppData } from './core/state';
import { ToastProvider } from './components/ui';

export function App() {
  const { activeTab, selectedProfileId, setSelectedProfileId, reloadPreferences } = useApp();
  const [isAddProfileOpen, setIsAddProfileOpen] = useState(false);
  const [isManageProfilesOpen, setIsManageProfilesOpen] = useState(false);
  const [profileToDelete, setProfileToDelete] = useState(null);

  const appData = useAppData();
  const { profiles, documents, expenses, addProfile, deleteProfile } = appData;
  // Import/reset also refreshes in-memory preferences (global mute).
  const reloadAll = () => { appData.reloadAll(); reloadPreferences(); };

  useEffect(() => {
    if (profiles?.length === 1 && selectedProfileId === 'all') {
      setSelectedProfileId(profiles[0].id);
    } else if (selectedProfileId !== 'all' && profiles && !profiles.some((p) => p.id === selectedProfileId)) {
      // Remembered profile no longer exists (deleted, reset, import): fall back.
      setSelectedProfileId(profiles.length === 1 ? profiles[0].id : 'all');
    }
  }, [profiles, selectedProfileId, setSelectedProfileId]);

  const handleDeleteProfile = (profileId) => {
    deleteProfile(profileId);
    if (selectedProfileId === profileId) {
      const remaining = profiles.filter((p) => p.id !== profileId);
      setSelectedProfileId(remaining.length === 1 ? remaining[0].id : 'all');
    }
  };

  return (
    <ToastProvider>
      <div className="app-shell">
        <Navbar
          profiles={profiles}
          expenses={expenses}
          documents={documents}
          onOpenManageModal={() => setIsManageProfilesOpen(true)}
        />

        <main className="main-content">
          <TabContent
            activeTab={activeTab}
            selectedProfileId={selectedProfileId}
            onSelectProfile={setSelectedProfileId}
            {...appData}
          reloadAll={reloadAll}
          />
        </main>

        <ProfileManagementModal
          isOpen={isManageProfilesOpen}
          onClose={() => setIsManageProfilesOpen(false)}
          profiles={profiles}
          selectedProfileId={selectedProfileId}
          expenses={expenses}
          onSelectProfile={setSelectedProfileId}
          onOpenAddModal={() => setIsAddProfileOpen(true)}
          onRequestDeleteProfile={(p) => setProfileToDelete(p)}
        />

        <ProfileModalsContainer
          isAddOpen={isAddProfileOpen}
          onCloseAdd={() => setIsAddProfileOpen(false)}
          onAddProfile={addProfile}
          profileToDelete={profileToDelete}
          onCloseDelete={() => setProfileToDelete(null)}
          onConfirmDelete={handleDeleteProfile}
          expenses={expenses}
          documents={documents}
        />
      </div>
    </ToastProvider>
  );
}

export default App;
