import { useCallback, useEffect, useRef } from 'react';
import { takeOut, putBack, takeKey, omitKey, restoreKey } from './profileBundle';
import { storageService } from '../storage';
import { writeJSON } from '../storage/safeStorage';
import { DATA_KEYS } from '../storage/storageKeys';

// Budget strategies live only in storage (BudgetTab re-reads them when it mounts).
const writeStrategies = (map) => writeJSON(DATA_KEYS.BUDGET_STRATEGIES, map);

const FINANCE_MAPS = ['profileFunds', 'profileFundConfigs', 'profileIncomes', 'profileIncomeConfigs'];

// Delete a profile together with its expenses, documents and per-profile finance
// (fund, income, configs) and return a snapshot that restoreProfileBundle puts back.
// Reads the latest state through a ref, so both handlers stay stable.
export function useProfileBundle({ state, setExpenses, setDocuments, removeProfile, restoreProfile, financeSetters }) {
  const latest = useRef(state);
  useEffect(() => { latest.current = state; }, [state]);

  const deleteProfile = useCallback((profileId) => {
    const cur = latest.current;
    const profileIndex = cur.profiles.findIndex((p) => p.id === profileId);
    if (profileIndex < 0) return null;
    const ofProfile = (x) => x.profileId === profileId;
    const snapshot = {
      profile: cur.profiles[profileIndex],
      profileIndex,
      expenses: takeOut(cur.expenses, ofProfile).removed,
      documents: takeOut(cur.documents, ofProfile).removed,
      finance: Object.fromEntries(FINANCE_MAPS.map((name) => [name, takeKey(cur[name] || {}, profileId)])),
      strategy: takeKey(storageService.getProfileStrategies(), profileId),
    };
    if (snapshot.strategy.present) writeStrategies(omitKey(storageService.getProfileStrategies(), profileId));
    removeProfile(profileId);
    setExpenses((prev) => prev.filter((e) => !ofProfile(e)));
    setDocuments((prev) => prev.filter((d) => !ofProfile(d)));
    FINANCE_MAPS.forEach((name) => financeSetters[name]((prev) => omitKey(prev, profileId)));
    return snapshot;
  }, [removeProfile, setExpenses, setDocuments, financeSetters]);

  const restoreProfileBundle = useCallback((snapshot) => {
    if (!snapshot?.profile) return;
    const id = snapshot.profile.id;
    FINANCE_MAPS.forEach((name) => financeSetters[name]((prev) => restoreKey(prev, id, snapshot.finance?.[name])));
    if (snapshot.strategy?.present) {
      writeStrategies(restoreKey(storageService.getProfileStrategies(), id, snapshot.strategy));
    }
    restoreProfile(snapshot.profile, snapshot.profileIndex);
    setExpenses((prev) => putBack(prev, snapshot.expenses || []));
    setDocuments((prev) => putBack(prev, snapshot.documents || []));
  }, [restoreProfile, setExpenses, setDocuments, financeSetters]);

  return { deleteProfile, restoreProfileBundle };
}
