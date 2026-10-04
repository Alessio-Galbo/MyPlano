export const ORPHAN_ITEMS_ANCHOR = 'orphan-items-card';

// Waits (a few frames) for the Settings card to mount after the tab switch, then scrolls to it.
export function scrollToOrphanItemsCard(triesLeft = 30) {
  const el = document.getElementById(ORPHAN_ITEMS_ANCHOR);
  if (el) { el.scrollIntoView({ behavior: 'smooth', block: 'start' }); return; }
  if (triesLeft > 0) requestAnimationFrame(() => scrollToOrphanItemsCard(triesLeft - 1));
}
