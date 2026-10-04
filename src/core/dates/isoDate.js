// Calendar dates as 'YYYY-MM-DD' strings, always in LOCAL time.
// Never use new Date('YYYY-MM-DD') (UTC) or toISOString().split('T')[0] (shifts the day).

export function parseISODate(iso) {
  if (!iso || typeof iso !== 'string') return null;
  const [y, m, d] = iso.slice(0, 10).split('-').map(Number);
  if (!y || !m || !d) return null;
  return new Date(y, m - 1, d);
}

export function toISODate(date) {
  if (!(date instanceof Date) || isNaN(date)) return '';
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${date.getFullYear()}-${m}-${d}`;
}

export function todayISO() {
  return toISODate(new Date());
}

export function daysInMonth(year, monthIndex) {
  return new Date(year, monthIndex + 1, 0).getDate();
}

// Adds n months keeping the anchor day, clamped to the month's last day
// (31 Jan + 1 = 28/29 Feb, + 2 = 31 Mar). anchorDay defaults to the day of iso.
export function addMonthsClamped(iso, n, anchorDay) {
  const base = parseISODate(iso);
  if (!base) return '';
  const total = base.getMonth() + n;
  const year = base.getFullYear() + Math.floor(total / 12);
  const month = ((total % 12) + 12) % 12;
  const day = Math.min(anchorDay || base.getDate(), daysInMonth(year, month));
  return toISODate(new Date(year, month, day));
}

export function addDays(iso, n) {
  const base = parseISODate(iso);
  if (!base) return '';
  return toISODate(new Date(base.getFullYear(), base.getMonth(), base.getDate() + n));
}

// Whole days from a to b (b - a), DST-safe.
export function diffDays(aIso, bIso) {
  const a = parseISODate(aIso);
  const b = parseISODate(bIso);
  if (!a || !b) return NaN;
  return Math.round((Date.UTC(b.getFullYear(), b.getMonth(), b.getDate())
    - Date.UTC(a.getFullYear(), a.getMonth(), a.getDate())) / 86400000);
}
