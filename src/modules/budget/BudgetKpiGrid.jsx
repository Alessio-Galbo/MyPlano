import React, { useState } from 'react';
import { BudgetKpiCarousel } from './BudgetKpiCarousel';
import { UpcomingDeadlinesCard } from './UpcomingDeadlinesCard';
import { UpcomingDetailModal } from './UpcomingDetailModal';
import { NotificationCenterModal } from '../../components/layout/NotificationCenterModal';
import { useNotifications } from '../../components/layout/useNotifications';
import './BudgetKpiGrid.css';

export function BudgetKpiGrid({
  discretionaryMargin = 0,
  monthlyIncome = 0,
  showDiscretionary = true,
  expenses = [],
  documents = [],
  selectedProfileId = 'all',
  profiles = [],
}) {
  const [isCenterOpen, setIsCenterOpen] = useState(false);
  const [detailItem, setDetailItem] = useState(null);

  const { allUpcoming, activeList, isDismissed, dismissedCount, toggleItem, restoreAll } =
    useNotifications(expenses, documents, selectedProfileId);

  if (!showDiscretionary) {
    return (
      <div className="budget-kpi-container single-card-mode">
        <UpcomingDeadlinesCard items={activeList} profiles={profiles} />
      </div>
    );
  }

  return (
    <>
      <BudgetKpiCarousel
        discretionaryMargin={discretionaryMargin}
        monthlyIncome={monthlyIncome}
        upcomingItems={activeList}
        profiles={profiles}
        onOpenNotificationCenter={() => setIsCenterOpen(true)}
      />

      {isCenterOpen && (
        <NotificationCenterModal
          isOpen
          onClose={() => setIsCenterOpen(false)}
          items={allUpcoming}
          profiles={profiles}
          isDismissed={isDismissed}
          dismissedCount={dismissedCount}
          onToggleVisibility={toggleItem}
          onRestoreAll={restoreAll}
          onViewDetails={(item) => {
            setIsCenterOpen(false);
            setDetailItem(item);
          }}
        />
      )}

      <UpcomingDetailModal
        item={detailItem}
        isOpen={Boolean(detailItem)}
        onClose={() => setDetailItem(null)}
      />
    </>
  );
}
