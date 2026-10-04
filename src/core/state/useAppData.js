import { useState } from 'react';
import { storageService } from '../storage';
import { createItemId } from '../storage/idMigrationHelper';
import { useProfileFinance } from './useProfileFinance';
import { useProfileState } from './useProfileState';

export function useAppData() {
  const profileFinance = useProfileFinance();
  const profileState = useProfileState(profileFinance);
  const { profiles, addProfile, updateProfileBalance, depositQuotaToProfile, updateProfileIncome, reloadProfiles } = profileState;

  const [documents, setDocuments] = useState(() => storageService.getDocuments());
  const [expenses, setExpenses] = useState(() => storageService.getExpenses());
  const [initialBalance, setInitialBalance] = useState(() => storageService.getInitialBalance());
  const [monthlyIncome, setMonthlyIncome] = useState(() => storageService.getMonthlyIncome());

  const updateInitialBalance = (amount) => {
    const val = parseFloat(amount) || 0;
    setInitialBalance(val);
    storageService.saveInitialBalance(val);
  };

  const updateMonthlyIncome = (amount) => {
    const val = parseFloat(amount) || 0;
    setMonthlyIncome(val);
    storageService.saveMonthlyIncome(val);
  };

  const deleteProfile = (profileId) => {
    profileState.deleteProfile(profileId);
    const nextExpenses = expenses.filter((e) => e.profileId !== profileId);
    setExpenses(nextExpenses);
    storageService.saveExpenses(nextExpenses);
    const nextDocs = documents.filter((d) => d.profileId !== profileId);
    setDocuments(nextDocs);
    storageService.saveDocuments(nextDocs);
  };

  const saveDocument = (doc) => {
    const item = doc.id ? doc : { ...doc, id: createItemId('doc') };
    const next = doc.id ? documents.map((d) => (d.id === item.id ? item : d)) : [item, ...documents];
    setDocuments(next);
    storageService.saveDocuments(next);
  };

  const deleteDocument = (id) => {
    const next = documents.filter((d) => d.id !== id);
    setDocuments(next);
    storageService.saveDocuments(next);
  };

  const saveExpense = (exp) => {
    const item = exp.id ? exp : { ...exp, id: createItemId('exp') };
    const next = exp.id ? expenses.map((e) => (e.id === item.id ? item : e)) : [item, ...expenses];
    setExpenses(next);
    storageService.saveExpenses(next);
  };

  const deleteExpense = (id) => {
    const next = expenses.filter((e) => e.id !== id);
    setExpenses(next);
    storageService.saveExpenses(next);
  };

  const reloadAll = () => {
    reloadProfiles();
    setDocuments(storageService.getDocuments());
    setExpenses(storageService.getExpenses());
    setInitialBalance(storageService.getInitialBalance());
    setMonthlyIncome(storageService.getMonthlyIncome());
    profileFinance.reloadProfileFinance();
  };

  return {
    profiles, documents, expenses, initialBalance, monthlyIncome, ...profileFinance,
    updateInitialBalance, onUpdateInitialBalance: updateInitialBalance,
    updateMonthlyIncome, onUpdateMonthlyIncome: updateMonthlyIncome,
    updateProfileBalance, updateProfileIncome, depositQuotaToProfile,
    addProfile, deleteProfile, saveDocument, deleteDocument,
    saveExpense, deleteExpense, reloadAll,
  };
}
