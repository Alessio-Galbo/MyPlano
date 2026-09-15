import { useState } from 'react';
import { storageService } from '../storage';
import { useProfileFinance } from './useProfileFinance';

export function useAppData() {
  const [profiles, setProfiles] = useState(() => storageService.getProfiles());
  const [documents, setDocuments] = useState(() => storageService.getDocuments());
  const [expenses, setExpenses] = useState(() => storageService.getExpenses());
  const [initialBalance, setInitialBalance] = useState(() => storageService.getInitialBalance());
  const [monthlyIncome, setMonthlyIncome] = useState(() => storageService.getMonthlyIncome());

  const profileFinance = useProfileFinance();

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

  const addProfile = (p) => {
    const next = [...profiles, { ...p, id: `p-${Date.now()}` }];
    setProfiles(next);
    storageService.saveProfiles(next);
  };

  const deleteProfile = (profileId) => {
    const nextProfiles = profiles.filter((p) => p.id !== profileId);
    setProfiles(nextProfiles);
    storageService.saveProfiles(nextProfiles);

    const nextExpenses = expenses.filter((e) => e.profileId !== profileId);
    setExpenses(nextExpenses);
    storageService.saveExpenses(nextExpenses);

    const nextDocs = documents.filter((d) => d.profileId !== profileId);
    setDocuments(nextDocs);
    storageService.saveDocuments(nextDocs);
  };

  const saveDocument = (doc) => {
    const id = doc.id || `doc-${Date.now()}`;
    const next = doc.id ? documents.map((d) => (d.id === id ? doc : d)) : [doc, ...documents];
    setDocuments(next);
    storageService.saveDocuments(next);
  };

  const deleteDocument = (id) => {
    const next = documents.filter((d) => d.id !== id);
    setDocuments(next);
    storageService.saveDocuments(next);
  };

  const saveExpense = (exp) => {
    const id = exp.id || `exp-${Date.now()}`;
    const next = exp.id ? expenses.map((e) => (e.id === id ? exp : e)) : [exp, ...expenses];
    setExpenses(next);
    storageService.saveExpenses(next);
  };

  const deleteExpense = (id) => {
    const next = expenses.filter((e) => e.id !== id);
    setExpenses(next);
    storageService.saveExpenses(next);
  };

  const reloadAll = () => {
    setProfiles(storageService.getProfiles());
    setDocuments(storageService.getDocuments());
    setExpenses(storageService.getExpenses());
    setInitialBalance(storageService.getInitialBalance());
    setMonthlyIncome(storageService.getMonthlyIncome());
    profileFinance.reloadProfileFinance();
  };

  return {
    profiles, documents, expenses, initialBalance, monthlyIncome,
    ...profileFinance,
    updateInitialBalance, updateMonthlyIncome,
    addProfile, deleteProfile, saveDocument, deleteDocument, saveExpense, deleteExpense, reloadAll,
  };
}
