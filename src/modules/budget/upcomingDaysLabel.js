// "in 5 days" / "due today" / "overdue by 3 days" (documents: "expired 3 days ago").
export function getUpcomingDaysLabel(t, item) {
  const days = item?.diffDays ?? 0;
  if (days < 0) {
    const key = item.itemType === 'document' ? 'budget.metrics.overdue' : 'budget.metrics.overdueBy';
    return t(key).replace('{days}', Math.abs(days));
  }
  if (days === 0) return t('budget.metrics.dueToday');
  return t('budget.metrics.inDays').replace('{days}', days);
}
