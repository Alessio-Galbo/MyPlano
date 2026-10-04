// Pure comparisons between the stored data and the sample (seed) data. No imports, so the
// node test (Tools/test_demo_data.mjs) can load this file directly.

export const isEmptyValue = (v) => v === undefined || v === null || v === '' || v === false
  || (Array.isArray(v) && v.length === 0)
  || (typeof v === 'object' && !Array.isArray(v) && Object.keys(v).length === 0);

const same = (a, b) => JSON.stringify(a) === JSON.stringify(b);
const num = (v) => {
  if (v === undefined || v === null || v === '') return 0;
  return typeof v !== 'boolean' && Number.isFinite(Number(v)) ? Number(v) : v;
};

// Seed item matching `item`: same id, or same title + profile when the id was rewritten.
export function findSeed(seedList, item) {
  return seedList.find((s) => item.id && s.id === item.id)
    || seedList.find((s) => s.title === item.title && s.profileId === item.profileId);
}

// Every seed field unchanged; extra fields (e.g. added by migrations) must be empty.
export function sameItem(seed, item) {
  const seedOk = Object.keys(seed).every((k) => k === 'id' || same(seed[k], item[k]));
  return seedOk && Object.keys(item).every((k) => k === 'id' || k in seed || isEmptyValue(item[k]));
}

// Same for profiles, comparing numbers loosely ("1250" === 1250); a custom `hue` counts as a change.
export function sameProfile(seed, p) {
  const seedOk = Object.keys(seed).every((k) => num(seed[k]) === num(p[k]));
  return seedOk && Object.keys(p).every((k) => k in seed || isEmptyValue(p[k]));
}

const isSeedItem = (seedList) => (item) => {
  const seed = findSeed(seedList, item);
  return Boolean(seed) && sameItem(seed, item);
};

export function sameList(seedList, list = []) {
  return list.length === seedList.length && list.every(isSeedItem(seedList));
}

export function sameProfiles(seedProfiles, profiles = []) {
  return profiles.length === seedProfiles.length && seedProfiles.every((seed) => {
    const p = profiles.find((x) => x.id === seed.id);
    return Boolean(p) && sameProfile(seed, p);
  });
}

// Sample items still untouched next to the user's data. A sample profile is removable only if it is
// unchanged, has no custom settings (customProfileIds) and holds nothing but untouched sample items.
export function findDemoLeftovers({ profiles = [], expenses = [], documents = [] }, seeds, customProfileIds = new Set()) {
  const expenseIds = expenses.filter(isSeedItem(seeds.expenses)).map((e) => e.id);
  const documentIds = documents.filter(isSeedItem(seeds.documents)).map((d) => d.id);
  const exp = new Set(expenseIds);
  const docs = new Set(documentIds);
  const profileIds = profiles.filter((p) => {
    const seed = seeds.profiles.find((s) => s.id === p.id);
    if (!seed || !sameProfile(seed, p) || customProfileIds.has(p.id)) return false;
    return expenses.every((e) => e.profileId !== p.id || exp.has(e.id))
      && documents.every((d) => d.profileId !== p.id || docs.has(d.id));
  }).map((p) => p.id);
  return { profileIds, expenseIds, documentIds, total: profileIds.length + expenseIds.length + documentIds.length };
}
