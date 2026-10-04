import { INITIAL_PROFILES, INITIAL_EXPENSES, INITIAL_DOCUMENTS, storageService } from '../../core/storage';
import { sameList, sameProfiles, findDemoLeftovers } from './demoCompare';

const SEEDS = { profiles: INITIAL_PROFILES, expenses: INITIAL_EXPENSES, documents: INITIAL_DOCUMENTS };

// Profiles with a budget strategy or fund/income settings chosen by the user.
export function readCustomProfileIds() {
  const ids = new Set();
  Object.entries(storageService.getProfileStrategies() || {}).forEach(([id, s]) => { if (s !== 'standard') ids.add(id); });
  Object.keys(storageService.getProfileFundConfigs() || {}).forEach((id) => ids.add(id));
  Object.keys(storageService.getProfileIncomeConfigs() || {}).forEach((id) => ids.add(id));
  return ids;
}

// True only when the data is exactly the sample data (nothing added, removed or changed, no
// custom settings): only then the banner offers to wipe everything.
export function isDemoData({ profiles, expenses, documents }) {
  return sameProfiles(INITIAL_PROFILES, profiles) && sameList(INITIAL_EXPENSES, expenses)
    && sameList(INITIAL_DOCUMENTS, documents) && readCustomProfileIds().size === 0;
}

// Untouched sample items left next to the user's own data (e.g. a profile created from the menu).
export function getDemoLeftovers(data) {
  return findDemoLeftovers(data, SEEDS, readCustomProfileIds());
}

// Removes only those untouched sample items, re-checked on the stored data. Returns what was removed.
export function removeDemoLeftovers() {
  const data = {
    profiles: storageService.getProfiles(),
    expenses: storageService.getExpenses(),
    documents: storageService.getDocuments(),
  };
  const left = getDemoLeftovers(data);
  const keep = (ids) => (x) => !ids.includes(x.id);
  storageService.saveExpenses(data.expenses.filter(keep(left.expenseIds)));
  storageService.saveDocuments(data.documents.filter(keep(left.documentIds)));
  storageService.saveProfiles(data.profiles.filter(keep(left.profileIds)));
  const funds = { ...storageService.getProfileFunds() };
  const incomes = { ...storageService.getProfileIncomes() };
  left.profileIds.forEach((id) => { delete funds[id]; delete incomes[id]; });
  storageService.saveProfileFunds(funds);
  storageService.saveProfileIncomes(incomes);
  return left;
}
