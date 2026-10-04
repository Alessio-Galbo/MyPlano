const norm = (s) => String(s || '').trim().toLocaleLowerCase();

// True when another profile (not `ownId`) already has this name (case/spaces ignored).
export const isDuplicateName = (name, profiles = [], ownId = null) =>
  !!norm(name) && profiles.some((p) => p.id !== ownId && norm(p.name) === norm(name));
