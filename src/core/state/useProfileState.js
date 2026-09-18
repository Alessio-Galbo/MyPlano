import { useState } from 'react';
import { storageService } from '../storage';

export function useProfileState(profileFinance) {
  const [profiles, setProfiles] = useState(() => storageService.getProfiles());

  const addProfile = (p) => {
    const newProfile = {
      ...p,
      id: `p-${Date.now()}`,
      initialBalance: Number(p.initialBalance || 0),
      monthlyIncome: Number(p.monthlyIncome || 0),
    };
    setProfiles((prev) => {
      const next = [...prev, newProfile];
      storageService.saveProfiles(next);
      return next;
    });
    profileFinance?.updateProfileFund(newProfile.id, newProfile.initialBalance);
    profileFinance?.updateProfileIncome(newProfile.id, newProfile.monthlyIncome);
  };

  const deleteProfile = (profileId) => {
    setProfiles((prev) => {
      const next = prev.filter((p) => p.id !== profileId);
      storageService.saveProfiles(next);
      return next;
    });
  };

  const updateProfileBalance = (profileId, amount) => {
    const val = parseFloat(amount) || 0;
    setProfiles((prev) => {
      const next = prev.map((p) => (p.id === profileId ? { ...p, initialBalance: val } : p));
      storageService.saveProfiles(next);
      return next;
    });
    profileFinance?.updateProfileFund(profileId, val);
  };

  const depositQuotaToProfile = (profileId, addedAmount) => {
    const addVal = parseFloat(addedAmount) || 0;
    setProfiles((prev) => {
      let finalVal = 0;
      const next = prev.map((p) => {
        if (p.id === profileId) {
          finalVal = Math.round(((Number(p.initialBalance) || 0) + addVal) * 100) / 100;
          return { ...p, initialBalance: finalVal };
        }
        return p;
      });
      storageService.saveProfiles(next);
      profileFinance?.updateProfileFund(profileId, finalVal);
      return next;
    });
  };

  const updateProfileIncome = (profileId, amount) => {
    const val = parseFloat(amount) || 0;
    setProfiles((prev) => {
      const next = prev.map((p) => (p.id === profileId ? { ...p, monthlyIncome: val } : p));
      storageService.saveProfiles(next);
      return next;
    });
    profileFinance?.updateProfileIncome(profileId, val);
  };

  const reloadProfiles = () => setProfiles(storageService.getProfiles());

  return {
    profiles,
    addProfile,
    deleteProfile,
    updateProfileBalance,
    depositQuotaToProfile,
    updateProfileIncome,
    reloadProfiles,
  };
}
