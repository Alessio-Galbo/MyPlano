import React from 'react';
import { Navbar, TabContent } from './components/layout';
import {
  ProfileModalsContainer, ProfileManagementModal,
  useProfileDialogs, useProfileSelectionGuard, useProfileColorStyles,
} from './modules/profiles';
import { useApp, useAppData } from './core/state';
import { useAddProfileRequest, useManageProfilesRequest } from './core/state/profileActions';
import { ToastProvider } from './components/ui';

export function App() {
  const { activeTab, selectedProfileId, setSelectedProfileId, reloadPreferences } = useApp();
  const dialogs = useProfileDialogs();
  // "New profile" / "Manage profiles" can be requested from anywhere (settings, empty states, onboarding).
  useAddProfileRequest(dialogs.openAdd);
  useManageProfilesRequest(dialogs.openManage);

  const appData = useAppData();
  const { profiles, documents, expenses } = appData;
  // Import/reset also refreshes in-memory preferences (global mute).
  const reloadAll = () => { appData.reloadAll(); reloadPreferences(); };

  useProfileSelectionGuard(profiles, selectedProfileId, setSelectedProfileId);
  useProfileColorStyles(profiles);

  return (
    <ToastProvider>
      <div className="app-shell">
        <Navbar
          profiles={profiles}
          expenses={expenses}
          documents={documents}
          onOpenManageModal={dialogs.openManage}
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
          isOpen={dialogs.isManageOpen}
          onClose={dialogs.closeManage}
          profiles={profiles}
          selectedProfileId={selectedProfileId}
          expenses={expenses}
          onSelectProfile={setSelectedProfileId}
          onOpenAddModal={dialogs.openAdd}
          onRequestDeleteProfile={dialogs.setProfileToDelete}
          onRequestEditProfile={dialogs.setProfileToEdit}
        />

        <ProfileModalsContainer
          isAddOpen={dialogs.isAddOpen}
          onCloseAdd={dialogs.closeAdd}
          onAddProfile={appData.addProfile}
          profileToEdit={dialogs.profileToEdit}
          onCloseEdit={dialogs.closeEdit}
          onUpdateProfile={appData.updateProfile}
          profileToDelete={dialogs.profileToDelete}
          onCloseDelete={dialogs.closeDelete}
          deleteProfile={appData.deleteProfile}
          restoreProfileBundle={appData.restoreProfileBundle}
          profiles={profiles}
          expenses={expenses}
          documents={documents}
        />
      </div>
    </ToastProvider>
  );
}

export default App;
