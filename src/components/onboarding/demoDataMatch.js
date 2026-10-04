import { INITIAL_PROFILES, INITIAL_EXPENSES, INITIAL_DOCUMENTS, storageService } from '../../core/storage';

// True only when the data is exactly the sample data: same profiles, expenses and documents
// (none added or removed, content unchanged, no custom colour) and no budget strategy or
// fund/income settings chosen. Any user edit → false, so the banner never offers to wipe real data.

const isEmptyValue = (v) => v === undefined || v === null || v === '' || v === false
  || (Array.isArray(v) && v.length === 0)
  || (typeof v === 'object' && !Array.isArray(v) && Object.keys(v).length === 0);

const same = (a, b) => JSON.stringify(a) === JSON.stringify(b);

const keyOf = (item) => item.id || `${item.title}|${item.profileId}`;

// Every seed field must be unchanged; extra fields (e.g. added by migrations) must be empty.
function sameItem(seed, item) {
  const seedOk = Object.keys(seed).every((k) => k === 'id' || same(seed[k], item[k]));
  const extrasOk = Object.keys(item).every((k) => k === 'id' || k in seed || isEmptyValue(item[k]));
  return seedOk && extrasOk;
}

function sameList(seedList, list = []) {
  if (list.length !== seedList.length) return false;
  const byKey = new Map(seedList.map((s) => [keyOf(s), s]));
  const byTitle = new Map(seedList.map((s) => [`${s.title}|${s.profileId}`, s]));
  return list.every((item) => {
    const seed = byKey.get(keyOf(item)) || byTitle.get(`${item.title}|${item.profileId}`);
    return Boolean(seed) && sameItem(seed, item);
  });
}

const num = (v) => (typeof v === 'number' || v === undefined ? Number(v) || 0 : v);

function sameProfiles(profiles = []) {
  if (profiles.length !== INITIAL_PROFILES.length) return false;
  return INITIAL_PROFILES.every((seed) => {
    const p = profiles.find((x) => x.id === seed.id);
    if (!p) return false;
    const seedOk = Object.keys(seed).every((k) => num(seed[k]) === num(p[k]));
    return seedOk && Object.keys(p).every((k) => k in seed || isEmptyValue(p[k])); // e.g. custom `hue`
  });
}

const hasEntries = (obj) => Boolean(obj) && Object.keys(obj).length > 0;

function noCustomSettings() {
  const strategies = Object.values(storageService.getProfileStrategies() || {});
  return strategies.every((s) => s === 'standard')
    && !hasEntries(storageService.getProfileFundConfigs())
    && !hasEntries(storageService.getProfileIncomeConfigs());
}

export function isDemoData({ profiles, expenses, documents }) {
  return sameProfiles(profiles) && sameList(INITIAL_EXPENSES, expenses)
    && sameList(INITIAL_DOCUMENTS, documents) && noCustomSettings();
}
