// Pure helpers to take a profile and everything that belongs to it out of the
// stored lists/maps, and to put it back exactly where it was ("undo" after delete).

// Splits a list: { kept, removed: [{ item, index }] } (index = original position).
export function takeOut(list, belongs) {
  const kept = [];
  const removed = [];
  list.forEach((item, index) => (belongs(item) ? removed.push({ item, index }) : kept.push(item)));
  return { kept, removed };
}

// Re-inserts removed items at their original positions (clamped to the current length).
// Items whose id is already in the list again are skipped (undo pressed twice).
export function putBack(list, removed) {
  const next = [...list];
  const ids = new Set(next.map((x) => x.id));
  [...removed].sort((a, b) => a.index - b.index).forEach(({ item, index }) => {
    if (item?.id !== undefined && ids.has(item.id)) return;
    next.splice(Math.min(index, next.length), 0, item);
  });
  return next;
}

// Remembers one key of a map (value + key order) so it can be restored in place.
export function takeKey(map, key) {
  return { present: Object.hasOwn(map, key), value: map[key], order: Object.keys(map) };
}

export function omitKey(map, key) {
  if (!Object.hasOwn(map, key)) return map;
  const next = { ...map };
  delete next[key];
  return next;
}

// Puts the key back keeping the original key order (so the stored JSON is identical).
export function restoreKey(map, key, saved) {
  if (!saved?.present) return map;
  const next = {};
  saved.order.forEach((k) => {
    if (k === key) next[k] = saved.value;
    else if (Object.hasOwn(map, k)) next[k] = map[k];
  });
  Object.keys(map).forEach((k) => { if (!Object.hasOwn(next, k)) next[k] = map[k]; });
  return next;
}
