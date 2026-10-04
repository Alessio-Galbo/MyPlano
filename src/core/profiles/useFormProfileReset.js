import { useEffect } from 'react';
import { useApp } from '../state';
import { hasProfile, pickInitialProfileId } from './orphanItems';

// Resets an add/edit form when it opens. New items start on the profile selected at the top
// (or the first one). If a profile is created while the form is open (e.g. from the
// "no profiles" notice) the typed values are kept and only the profile is filled in.
export function useFormProfileReset({ isOpen, editingItem, profiles, setFormData, makeNew, makeEdit }) {
  const { selectedProfileId } = useApp();

  useEffect(() => {
    if (!isOpen) return;
    setFormData(editingItem ? makeEdit(editingItem) : makeNew(pickInitialProfileId(selectedProfileId, profiles)));
    // Only on open / item change: a profiles change must not wipe what the user typed.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, editingItem]);

  useEffect(() => {
    if (!isOpen || editingItem) return;
    setFormData((f) => (hasProfile(profiles, f.profileId)
      ? f : { ...f, profileId: pickInitialProfileId(selectedProfileId, profiles) }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profiles]);
}
