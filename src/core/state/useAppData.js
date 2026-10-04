import { useCallback, useMemo } from 'react';
import { storageService } from '../storage';
import { createItemId } from '../storage/idMigrationHelper';
import { useProfileFinance } from './useProfileFinance';
import { useProfileState } from './useProfileState';
import { useProfileBundle } from './useProfileBundle';
import { usePersistedSlice } from './usePersistedSlice';
import { useStorageSync } from './useStorageSync';
import { announceDataChange } from './uiActions';

const readDocuments = () => storageService.getDocuments();
const writeDocuments = (v) => announceDataChange(storageService.saveDocuments(v));
const readExpenses = () => storageService.getExpenses();
const writeExpenses = (v) => announceDataChange(storageService.saveExpenses(v));
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
  const { reloadProfileFinance, financeSetters, ...financeData } = profileFinance;

  const [documents, setDocuments, reloadDocuments] = usePersistedSlice(readDocuments, writeDocuments);
  const [expenses, setExpenses, reloadExpenses] = usePersistedSlice(readExpenses, writeExpenses);
  const [initialBalance, setInitialBalance, reloadInitialBalance] = usePersistedSlice(readInitialBalance, writeInitialBalance);
  const [monthlyIncome, setMonthlyIncome, reloadMonthlyIncome] = usePersistedSlice(readMonthlyIncome, writeMonthlyIncome);

  // Stable handlers (useCallback, setters never change): memoised tabs skip unrelated re-renders.
  const updateInitialBalance = useCallback((amount) => setInitialBalance(parseFloat(amount) || 0), [setInitialBalance]);
  const updateMonthlyIncome = useCallback((amount) => setMonthlyIncome(parseFloat(amount) || 0), [setMonthlyIncome]);

  // deleteProfile(id) -> snapshot (or null); restoreProfileBundle(snapshot) undoes it.
  const { profileFunds, profileFundConfigs, profileIncomes, profileIncomeConfigs } = profileFinance;
  const bundleState = useMemo(() => ({
    profiles, expenses, documents, profileFunds, profileFundConfigs, profileIncomes, profileIncomeConfigs,
  }), [profiles, expenses, documents, profileFunds, profileFundConfigs, profileIncomes, profileIncomeConfigs]);
  const { deleteProfile, restoreProfileBundle } = useProfileBundle({
    state: bundleState, setExpenses, setDocuments, financeSetters,
    removeProfile: profileState.deleteProfile, restoreProfile: profileState.restoreProfile,
  });

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

  const { updateProfileBalance, adjustProfileBalance, depositQuotaToProfile, updateProfileIncome, addProfile, updateProfile } = profileState;
  return {
    profiles, documents, expenses, initialBalance, monthlyIncome, ...financeData,
    updateInitialBalance, onUpdateInitialBalance: updateInitialBalance,
    updateMonthlyIncome, onUpdateMonthlyIncome: updateMonthlyIncome,
    updateProfileBalance, adjustProfileBalance, onAdjustProfileBalance: adjustProfileBalance,
    updateProfileIncome, onUpdateProfileIncome: updateProfileIncome, depositQuotaToProfile,
    addProfile, updateProfile, deleteProfile, restoreProfileBundle, saveDocument, deleteDocument, saveExpense, deleteExpense,
    restoreDocument: saveDocument, restoreExpense: saveExpense, reloadAll,
  };
}
