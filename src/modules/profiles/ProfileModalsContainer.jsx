import React from 'react';
import { AddProfileModal } from './AddProfileModal';
import { DeleteProfileModal } from './DeleteProfileModal';
import { useProfileDeleteWithUndo } from './useProfileDeleteWithUndo';

const countOf = (list, profile) => (profile ? list.filter((x) => x.profileId === profile.id).length : 0);

// Create / edit / delete dialogs of profiles. Lives inside ToastProvider (delete offers "Undo").
export function ProfileModalsContainer({
  isAddOpen,
  onCloseAdd,
  onAddProfile,
  profileToEdit,
  onCloseEdit,
  onUpdateProfile,
  profileToDelete,
  onCloseDelete,
  deleteProfile,
  restoreProfileBundle,
  profiles = [],
  expenses = [],
  documents = [],
}) {
  const handleConfirmDelete = useProfileDeleteWithUndo({ deleteProfile, restoreProfileBundle });

  return (
    <>
      {isAddOpen && (
        <AddProfileModal isOpen onClose={onCloseAdd} onAddProfile={onAddProfile} profiles={profiles} />
      )}

      {profileToEdit && (
        <AddProfileModal
          key={profileToEdit.id}
          isOpen
          onClose={onCloseEdit}
          onUpdateProfile={onUpdateProfile}
          profile={profileToEdit}
          profiles={profiles}
        />
      )}

      <DeleteProfileModal
        isOpen={Boolean(profileToDelete)}
        onClose={onCloseDelete}
        profile={profileToDelete}
        expensesCount={countOf(expenses, profileToDelete)}
        documentsCount={countOf(documents, profileToDelete)}
        onConfirmDelete={handleConfirmDelete}
      />
    </>
  );
}
