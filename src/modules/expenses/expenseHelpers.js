export function formatCurrency(amount) {
  return Number(amount || 0).toLocaleString('it-IT', {
    style: 'currency',
    currency: 'EUR',
  });
}

export function advanceNextDueDate(currentDateStr, frequency, customInterval = 1, customUnit = 'months') {
  const date = currentDateStr ? new Date(currentDateStr) : new Date();

  switch (frequency) {
    case 'monthly':
      date.setMonth(date.getMonth() + 1);
      break;
    case 'bimonthly':
      date.setMonth(date.getMonth() + 2);
      break;
    case 'quarterly':
      date.setMonth(date.getMonth() + 3);
      break;
    case 'semiannual':
      date.setMonth(date.getMonth() + 6);
      break;
    case 'annual':
      date.setFullYear(date.getFullYear() + 1);
      break;
    case 'biennial':
      date.setFullYear(date.getFullYear() + 2);
      break;
    case 'custom':
      if (customUnit === 'days') {
        date.setDate(date.getDate() + (Number(customInterval) || 30));
      } else {
        date.setMonth(date.getMonth() + (Number(customInterval) || 1));
      }
      break;
    default:
      break;
  }

  return date.toISOString().split('T')[0];
}

export function getExpenseUrgency(dueDateStr) {
  if (!dueDateStr) return { variant: 'neutral', label: 'due' };
  const now = new Date();
  now.setHours(0, 0, 0, 0);

  const due = new Date(dueDateStr);
  due.setHours(0, 0, 0, 0);

  const diffDays = Math.ceil((due.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

  if (diffDays < 0) return { variant: 'danger', label: 'overdue' };
  if (diffDays <= 15) return { variant: 'warning', label: 'upcoming' };
  return { variant: 'neutral', label: 'due' };
}

export function getCategoryLabel(category, t) {
  if (!category) return '';
  const key = `expenses.categories.${category}`;
  const translated = t(key);
  return translated !== key ? translated : category;
}
