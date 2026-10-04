import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { useI18n } from '../../core/i18n';
import './UpcomingGroupedList.css';

// Renders deadlines with the "Overdue" group first (red), then the upcoming ones.
export function UpcomingGroupedList({ items = [], renderItem }) {
  const { t } = useI18n();
  const overdue = items.filter((it) => it.isOverdue);
  const upcoming = items.filter((it) => !it.isOverdue);
  if (overdue.length === 0) return <>{upcoming.map(renderItem)}</>;

  return (
    <>
      <div className="upcoming-group-label is-overdue">
        <AlertTriangle size={12} aria-hidden="true" />
        <span>{t('budget.metrics.overdueGroup')} ({overdue.length})</span>
      </div>
      {overdue.map(renderItem)}
      {upcoming.length > 0 && (
        <div className="upcoming-group-label">{t('budget.metrics.upcomingGroup')}</div>
      )}
      {upcoming.map(renderItem)}
    </>
  );
}
