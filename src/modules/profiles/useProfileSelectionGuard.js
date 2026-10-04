import { useEffect, useRef } from 'react';

// Keeps the selected profile valid when the profile list changes (delete, reset, import, undo):
// - selected profile gone -> the only profile left, or 'all';
// - if that same id comes back later (import after a reset, "Undo" of a delete) and the user
//   has not picked anything else meanwhile, it is selected again;
// - a single profile is always selected instead of 'all'.
export function useProfileSelectionGuard(profiles, selectedProfileId, setSelectedProfileId) {
  const pending = useRef(null); // { id, fallback }

  useEffect(() => {
    if (!profiles) return;
    const has = (id) => profiles.some((p) => p.id === id);
    const p = pending.current;
    if (p) {
      if (selectedProfileId !== p.fallback) pending.current = null;
      else if (has(p.id)) {
        pending.current = null;
        setSelectedProfileId(p.id);
        return;
      }
    }
    if (selectedProfileId !== 'all' && !has(selectedProfileId)) {
      const fallback = profiles.length === 1 ? profiles[0].id : 'all';
      pending.current = { id: selectedProfileId, fallback };
      setSelectedProfileId(fallback);
      return;
    }
    if (profiles.length === 1 && selectedProfileId === 'all') setSelectedProfileId(profiles[0].id);
  }, [profiles, selectedProfileId, setSelectedProfileId]);
}
