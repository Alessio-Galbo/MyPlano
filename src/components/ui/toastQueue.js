// Pure queue logic for the toast stack: nothing is dropped when many toasts arrive at once,
// extra ones wait their turn; errors jump the queue so they are always on screen.
export const MAX_VISIBLE = 3;
export const MAX_QUEUED = 30;

const DURATIONS = { success: 3000, info: 4000, error: 6000 };
export const ACTION_DURATION = 8000;

export function defaultDuration(variant, hasAction) {
  if (hasAction) return ACTION_DURATION;
  return DURATIONS[variant] ?? DURATIONS.info;
}

// Same id → replaced in place (keeps its turn); otherwise appended. Overflow drops the oldest
// non-error waiting toast, never one already visible or an error.
export function enqueue(list, toast) {
  const index = list.findIndex((item) => item.id === toast.id);
  if (index >= 0) return list.map((item, i) => (i === index ? toast : item));
  const next = [...list, toast];
  if (next.length <= MAX_QUEUED) return next;
  const visible = new Set(selectVisible(next).map((item) => item.id));
  const drop = next.findIndex((item) => !visible.has(item.id) && item.variant !== 'error');
  return drop >= 0 ? next.filter((_, i) => i !== drop) : next;
}

// Errors first (arrival order), then the others in arrival order, up to `max`.
export function selectVisible(list, max = MAX_VISIBLE) {
  const errors = list.filter((item) => item.variant === 'error');
  const others = list.filter((item) => item.variant !== 'error');
  const chosen = new Set([...errors, ...others].slice(0, max));
  return list.filter((item) => chosen.has(item));
}
