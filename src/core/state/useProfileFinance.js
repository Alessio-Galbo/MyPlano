import { useState } from 'react';
import { storageService } from '../storage';

export function useProfileFinance() {
  const [profileFunds, setProfileFunds] = useState(() => storageService.getProfileFunds());
  const [profileFundConfigs, setProfileFundConfigs] = useState(() => storageService.getProfileFundConfigs());
  const [profileIncomes, setProfileIncomes] = useState(() => storageService.getProfileIncomes());
  const [profileIncomeConfigs, setProfileIncomeConfigs] = useState(() => storageService.getProfileIncomeConfigs());

  const updateProfileFund = (profileId, amount) => {
    const val = parseFloat(amount) || 0;
    const next = { ...profileFunds, [profileId]: val };
    setProfileFunds(next);
    storageService.saveProfileFunds(next);
  };

  const setProfileUsesDedicatedFund = (profileId, usesDedicated) => {
    const next = { ...profileFundConfigs, [profileId]: usesDedicated };
    setProfileFundConfigs(next);
    storageService.saveProfileFundConfigs(next);
  };

  const updateProfileIncome = (profileId, amount) => {
    const val = parseFloat(amount) || 0;
    const next = { ...profileIncomes, [profileId]: val };
    setProfileIncomes(next);
    storageService.saveProfileIncomes(next);
  };

  const setProfileUsesDedicatedIncome = (profileId, usesDedicated) => {
    const next = { ...profileIncomeConfigs, [profileId]: usesDedicated };
    setProfileIncomeConfigs(next);
    storageService.saveProfileIncomeConfigs(next);
  };

  const reloadProfileFinance = () => {
    setProfileFunds(storageService.getProfileFunds());
    setProfileFundConfigs(storageService.getProfileFundConfigs());
    setProfileIncomes(storageService.getProfileIncomes());
    setProfileIncomeConfigs(storageService.getProfileIncomeConfigs());
  };

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
    reloadProfileFinance,
  };
}
