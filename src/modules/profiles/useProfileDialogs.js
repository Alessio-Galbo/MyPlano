import { useCallback, useState } from 'react';

// Open/closed state of the profile dialogs. openAdd/openManage are stable: App.jsx hands them
// to useAddProfileRequest / useManageProfilesRequest (core/state/profileActions).
export function useProfileDialogs() {
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isManageOpen, setIsManageOpen] = useState(false);
  const [profileToEdit, setProfileToEdit] = useState(null);
  const [profileToDelete, setProfileToDelete] = useState(null);

  const openAdd = useCallback(() => setIsAddOpen(true), []);
  const openManage = useCallback(() => setIsManageOpen(true), []);

  return {
    isAddOpen, openAdd, closeAdd: () => setIsAddOpen(false),
    isManageOpen, openManage, closeManage: () => setIsManageOpen(false),
    profileToEdit, setProfileToEdit, closeEdit: () => setProfileToEdit(null),
    profileToDelete, setProfileToDelete, closeDelete: () => setProfileToDelete(null),
  };
}
