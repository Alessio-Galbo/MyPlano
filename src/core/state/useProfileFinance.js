import { useCallback } from 'react';
import { storageService } from '../storage';
import { usePersistedSlice } from './usePersistedSlice';

const readFunds = () => storageService.getProfileFunds();
const writeFunds = (v) => storageService.saveProfileFunds(v);
const readFundConfigs = () => storageService.getProfileFundConfigs();
const writeFundConfigs = (v) => storageService.saveProfileFundConfigs(v);
const readIncomes = () => storageService.getProfileIncomes();
const writeIncomes = (v) => storageService.saveProfileIncomes(v);
const readIncomeConfigs = () => storageService.getProfileIncomeConfigs();
const writeIncomeConfigs = (v) => storageService.saveProfileIncomeConfigs(v);

// Functional update of one or more map entries; keeps the same object when nothing changes.
const patchMap = (setter, entries) => setter((prev) => {
  let next = prev;
  entries.forEach(([id, val]) => {
    if (next[id] !== val) next = { ...next, [id]: val };
  });
  return next;
});

export function useProfileFinance() {
  const [profileFunds, setProfileFunds, reloadFunds] = usePersistedSlice(readFunds, writeFunds);
  const [profileFundConfigs, setFundConfigs, reloadFundConfigs] = usePersistedSlice(readFundConfigs, writeFundConfigs);
  const [profileIncomes, setProfileIncomes, reloadIncomes] = usePersistedSlice(readIncomes, writeIncomes);
  const [profileIncomeConfigs, setIncomeConfigs, reloadIncomeConfigs] = usePersistedSlice(readIncomeConfigs, writeIncomeConfigs);

  const updateProfileFund = (profileId, amount) => patchMap(setProfileFunds, [[profileId, parseFloat(amount) || 0]]);
  const setProfileUsesDedicatedFund = (profileId, usesDedicated) => patchMap(setFundConfigs, [[profileId, usesDedicated]]);
  const updateProfileIncome = (profileId, amount) => patchMap(setProfileIncomes, [[profileId, parseFloat(amount) || 0]]);
  const setProfileUsesDedicatedIncome = (profileId, usesDedicated) => patchMap(setIncomeConfigs, [[profileId, usesDedicated]]);

  // Funds/incomes mirror each profile's initialBalance/monthlyIncome.
  const syncFromProfiles = useCallback((profiles) => {
    patchMap(setProfileFunds, profiles.map((p) => [p.id, Number(p.initialBalance) || 0]));
    patchMap(setProfileIncomes, profiles.map((p) => [p.id, Number(p.monthlyIncome) || 0]));
  }, [setProfileFunds, setProfileIncomes]);

  const reloadProfileFinance = useCallback(() => {
    reloadFunds();
    reloadFundConfigs();
    reloadIncomes();
    reloadIncomeConfigs();
  }, [reloadFunds, reloadFundConfigs, reloadIncomes, reloadIncomeConfigs]);

  return {
    profileFunds,
    profileFundConfigs,
    profileIncomes,
    profileIncomeConfigs,
    updateProfileFund,
    onUpdateProfileFund: updateProfileFund,
    setProfileUsesDedicatedFund,
    onSetProfileUsesDedicatedFund: setProfileUsesDedicatedFund,
    updateProfileIncome,
    onUpdateProfileIncome: updateProfileIncome,
    setProfileUsesDedicatedIncome,
    onSetProfileUsesDedicatedIncome: setProfileUsesDedicatedIncome,
    syncFromProfiles,
    reloadProfileFinance,
  };
}
