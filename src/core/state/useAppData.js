import { useCallback } from 'react';
import { storageService } from '../storage';
import { createItemId } from '../storage/idMigrationHelper';
import { useProfileFinance } from './useProfileFinance';
import { useProfileState } from './useProfileState';
import { usePersistedSlice } from './usePersistedSlice';
import { useStorageSync } from './useStorageSync';

const readDocuments = () => storageService.getDocuments();
const writeDocuments = (v) => storageService.saveDocuments(v);
const readExpenses = () => storageService.getExpenses();
const writeExpenses = (v) => storageService.saveExpenses(v);
const readInitialBalance = () => storageService.getInitialBalance();
const writeInitialBalance = (v) => storageService.saveInitialBalance(v);
const readMonthlyIncome = () => storageService.getMonthlyIncome();
const writeMonthlyIncome = (v) => storageService.saveMonthlyIncome(v);

// Upsert: replaces the item with the same id, or inserts it on top when the id
// is new or no longer in the list (e.g. "undo" after a delete).
const upsert = (list, item) => (list.some((x) => x.id === item.id)
  ? list.map((x) => (x.id === item.id ? item : x))
  : [item, ...list]);
const withId = (item, prefix) => (item.id ? item : { ...item, id: createItemId(prefix) });

export function useAppData() {
  const profileFinance = useProfileFinance();
  const profileState = useProfileState(profileFinance);
  const { profiles, reloadProfiles } = profileState;
  const { reloadProfileFinance } = profileFinance;

  const [documents, setDocuments, reloadDocuments] = usePersistedSlice(readDocuments, writeDocuments);
  const [expenses, setExpenses, reloadExpenses] = usePersistedSlice(readExpenses, writeExpenses);
  const [initialBalance, setInitialBalance, reloadInitialBalance] = usePersistedSlice(readInitialBalance, writeInitialBalance);
  const [monthlyIncome, setMonthlyIncome, reloadMonthlyIncome] = usePersistedSlice(readMonthlyIncome, writeMonthlyIncome);

  // Stable handlers (useCallback, setters never change): memoised tabs skip unrelated re-renders.
  const updateInitialBalance = useCallback((amount) => setInitialBalance(parseFloat(amount) || 0), [setInitialBalance]);
  const updateMonthlyIncome = useCallback((amount) => setMonthlyIncome(parseFloat(amount) || 0), [setMonthlyIncome]);

  const removeProfile = profileState.deleteProfile;
  const deleteProfile = useCallback((profileId) => {
    removeProfile(profileId);
    setExpenses((prev) => prev.filter((e) => e.profileId !== profileId));
    setDocuments((prev) => prev.filter((d) => d.profileId !== profileId));
  }, [removeProfile, setExpenses, setDocuments]);

  const saveDocument = useCallback((doc) => {
    const item = withId(doc, 'doc');
    setDocuments((prev) => upsert(prev, item));
    return item;
  }, [setDocuments]);
  const deleteDocument = useCallback((id) => setDocuments((prev) => prev.filter((d) => d.id !== id)), [setDocuments]);

  const saveExpense = useCallback((exp) => {
    const item = withId(exp, 'exp');
    setExpenses((prev) => upsert(prev, item));
    return item;
  }, [setExpenses]);
  const deleteExpense = useCallback((id) => setExpenses((prev) => prev.filter((e) => e.id !== id)), [setExpenses]);

  const reloadAll = useCallback(() => {
    reloadProfiles();
    reloadDocuments();
    reloadExpenses();
    reloadInitialBalance();
    reloadMonthlyIncome();
    reloadProfileFinance();
  }, [reloadProfiles, reloadDocuments, reloadExpenses, reloadInitialBalance, reloadMonthlyIncome, reloadProfileFinance]);

  useStorageSync(reloadAll);

  const { updateProfileBalance, adjustProfileBalance, depositQuotaToProfile, updateProfileIncome, addProfile } = profileState;
  return {
    profiles, documents, expenses, initialBalance, monthlyIncome, ...profileFinance,
    updateInitialBalance, onUpdateInitialBalance: updateInitialBalance,
    updateMonthlyIncome, onUpdateMonthlyIncome: updateMonthlyIncome,
    updateProfileBalance, adjustProfileBalance, onAdjustProfileBalance: adjustProfileBalance,
    updateProfileIncome, onUpdateProfileIncome: updateProfileIncome, depositQuotaToProfile,
    addProfile, deleteProfile, saveDocument, deleteDocument, saveExpense, deleteExpense,
    restoreDocument: saveDocument, restoreExpense: saveExpense, reloadAll,
  };
}
