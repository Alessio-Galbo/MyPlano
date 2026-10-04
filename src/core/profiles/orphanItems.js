// Every expense and document must belong to an existing profile. These pure helpers find the
// ones that do not ("orphans") and pick a sensible profile for new items. Nothing here changes data.

const idSet = (profiles = []) => new Set(profiles.map((p) => String(p.id)));

export function hasProfile(profiles = [], profileId) {
  if (profileId === '' || profileId === null || profileId === undefined) return false;
  return idSet(profiles).has(String(profileId));
}

// Profile shown at the top of the app if it is a real profile, otherwise the first one ('' if none).
export function pickInitialProfileId(selectedProfileId, profiles = []) {
  if (selectedProfileId && selectedProfileId !== 'all' && hasProfile(profiles, selectedProfileId)) {
    return profiles.find((p) => String(p.id) === String(selectedProfileId)).id;
  }
  return profiles[0]?.id ?? '';
}

// [{ kind: 'expense' | 'document', id, title, profileId, item }] for items with an empty or unknown profileId.
export function findOrphanItems(expenses = [], documents = [], profiles = []) {
  const ids = idSet(profiles);
  const isOrphan = (item) => {
    const pid = item?.profileId;
    return pid === '' || pid === null || pid === undefined || !ids.has(String(pid));
  };
  const pick = (kind) => (item) => ({ kind, id: item.id, title: item.title || '', profileId: item.profileId ?? '', item });
  return [
    ...(Array.isArray(expenses) ? expenses : []).filter(isOrphan).map(pick('expense')),
    ...(Array.isArray(documents) ? documents : []).filter(isOrphan).map(pick('document')),
  ];
}

export const orphanKey = (o) => `${o.kind}|${o.id}`;

// Items to save after the user confirmed: only orphans with a chosen, existing profile.
// `choices` maps orphanKey -> profileId.
export function assignOrphanItems(orphans, choices, profiles = []) {
  return orphans
    .filter((o) => hasProfile(profiles, choices[orphanKey(o)]))
    .map((o) => ({ kind: o.kind, item: { ...o.item, profileId: choices[orphanKey(o)] } }));
}
