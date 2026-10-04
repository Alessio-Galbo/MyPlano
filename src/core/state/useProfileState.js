import { useCallback, useEffect } from 'react';
import { storageService } from '../storage';
import { createItemId } from '../storage/idMigrationHelper';
import { usePersistedSlice } from './usePersistedSlice';

const readProfiles = () => storageService.getProfiles();
const writeProfiles = (v) => storageService.saveProfiles(v);
const round2 = (n) => Math.round(n * 100) / 100;
const balanceOf = (p) => Number(p.initialBalance) || 0;

export function useProfileState(profileFinance) {
  const [profiles, setProfiles, reloadProfiles] = usePersistedSlice(readProfiles, writeProfiles);
  const syncFromProfiles = profileFinance?.syncFromProfiles;

  // Keep the per-profile fund/income maps aligned after every profile change
  // (outside the updaters: they must stay pure).
  useEffect(() => {
    syncFromProfiles?.(profiles);
  }, [profiles, syncFromProfiles]);

  // Handlers are stable (useCallback): memoised tabs skip unrelated re-renders.
  const patchProfile = useCallback((profileId, patch) => setProfiles((prev) => prev.map(
    (p) => (p.id === profileId ? { ...p, ...patch(p) } : p),
  )), [setProfiles]);

  const addProfile = useCallback((p) => {
    const newProfile = {
      ...p,
      id: createItemId('p'),
      initialBalance: Number(p.initialBalance || 0),
      monthlyIncome: Number(p.monthlyIncome || 0),
    };
    setProfiles((prev) => [...prev, newProfile]);
    return newProfile;
  }, [setProfiles]);

  const deleteProfile = useCallback(
    (profileId) => setProfiles((prev) => prev.filter((p) => p.id !== profileId)),
    [setProfiles],
  );

  // Edit name/colour (hue: number 0-359, or null for the automatic colour).
  const updateProfile = useCallback((profileId, changes) => patchProfile(profileId, () => changes), [patchProfile]);

  // Undo of a delete: puts the profile back at its original position.
  const restoreProfile = useCallback((profile, index) => setProfiles((prev) => {
    if (prev.some((p) => p.id === profile.id)) return prev;
    const next = [...prev];
    next.splice(Math.min(index, next.length), 0, profile);
    return next;
  }), [setProfiles]);

  // amount: number/string, or (currentBalance) => newBalance for atomic updates.
  const updateProfileBalance = useCallback((profileId, amount) => patchProfile(profileId, (p) => ({
    initialBalance: typeof amount === 'function'
      ? round2(Number(amount(balanceOf(p))) || 0)
      : parseFloat(amount) || 0,
  })), [patchProfile]);

  // Atomic +/- on the profile fund: safe for several calls in the same tick.
  const adjustProfileBalance = useCallback((profileId, delta) => {
    const d = Number(delta) || 0;
    if (!profileId || !d) return;
    patchProfile(profileId, (p) => ({ initialBalance: round2(balanceOf(p) + d) }));
  }, [patchProfile]);

  const depositQuotaToProfile = useCallback(
    (profileId, addedAmount) => adjustProfileBalance(profileId, parseFloat(addedAmount) || 0),
    [adjustProfileBalance],
  );

  const updateProfileIncome = useCallback((profileId, amount) => patchProfile(profileId, () => ({
    monthlyIncome: parseFloat(amount) || 0,
  })), [patchProfile]);

  return {
    profiles,
    addProfile,
    deleteProfile,
    updateProfile,
    restoreProfile,
    updateProfileBalance,
    adjustProfileBalance,
    depositQuotaToProfile,
    updateProfileIncome,
    reloadProfiles,
  };
}
