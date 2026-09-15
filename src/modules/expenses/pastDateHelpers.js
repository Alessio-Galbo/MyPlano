export function isDateInPast(dateStr) {
  if (!dateStr) return false;
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  const target = new Date(dateStr);
  target.setHours(0, 0, 0, 0);
  return target < now;
}

export function advanceMonths(date, months) {
  const d = new Date(date);
  d.setMonth(d.getMonth() + months);
  return d;
}

export function calculateNextFutureOccurrence(pastDateStr, frequency) {
  if (!pastDateStr) return '';
  const now = new Date();
  now.setHours(0, 0, 0, 0);

  let current = new Date(pastDateStr);
  current.setHours(0, 0, 0, 0);

  if (current >= now) return pastDateStr;

  let stepMonths = 12;
  switch (frequency) {
    case 'monthly': stepMonths = 1; break;
    case 'bimonthly': stepMonths = 2; break;
    case 'quarterly': stepMonths = 3; break;
    case 'semiannual': stepMonths = 6; break;
    case 'annual': stepMonths = 12; break;
    case 'biennial': stepMonths = 24; break;
    case 'oneOff': return pastDateStr;
    default: stepMonths = 12; break;
  }

  while (current < now) {
    current = advanceMonths(current, stepMonths);
  }

  return current.toISOString().split('T')[0];
}
