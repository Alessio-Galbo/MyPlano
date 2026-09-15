import React, { useState } from 'react';
import { Navbar, TabContent } from './components/layout';
import { ProfileBar, ProfileModalsContainer } from './modules/profiles';
import { useApp, useAppData } from './core/state';

export function App() {
  const { activeTab, selectedProfileId, setSelectedProfileId } = useApp();
  const [isAddProfileOpen, setIsAddProfileOpen] = useState(false);
  const [profileToDelete, setProfileToDelete] = useState(null);

  const appData = useAppData();
  const { profiles, documents, expenses, addProfile, deleteProfile } = appData;

  const handleDeleteProfile = (profileId) => {
    deleteProfile(profileId);
    if (selectedProfileId === profileId) {
      setSelectedProfileId('all');
    }
  };

  return (
    <div className="app-shell">
      <Navbar />

      <main className="main-content">
        <ProfileBar
          profiles={profiles}
          selectedProfileId={selectedProfileId}
          onSelectProfile={setSelectedProfileId}
          onOpenAddModal={() => setIsAddProfileOpen(true)}
          onRequestDeleteProfile={(p) => setProfileToDelete(p)}
        />

        <TabContent
          activeTab={activeTab}
          selectedProfileId={selectedProfileId}
          {...appData}
        />
      </main>

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
  );
}

export default App;
