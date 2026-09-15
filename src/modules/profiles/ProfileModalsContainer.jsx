import React from 'react';
import { AddProfileModal } from './AddProfileModal';
import { DeleteProfileModal } from './DeleteProfileModal';

export function ProfileModalsContainer({
  isAddOpen,
  onCloseAdd,
  onAddProfile,
  profileToDelete,
  onCloseDelete,
  onConfirmDelete,
  expenses = [],
  documents = [],
}) {
  const expensesCount = profileToDelete
    ? expenses.filter((e) => e.profileId === profileToDelete.id).length
    : 0;

  const documentsCount = profileToDelete
    ? documents.filter((d) => d.profileId === profileToDelete.id).length
    : 0;

  return (
    <>
      <AddProfileModal
        isOpen={isAddOpen}
        onClose={onCloseAdd}
        onAddProfile={onAddProfile}
      />

      <DeleteProfileModal
        isOpen={Boolean(profileToDelete)}
        onClose={onCloseDelete}
        profile={profileToDelete}
        expensesCount={expensesCount}
        documentsCount={documentsCount}
        onConfirmDelete={onConfirmDelete}
      />
    </>
  );
}
