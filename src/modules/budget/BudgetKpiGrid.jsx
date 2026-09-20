import React from 'react';
import { BudgetKpiCarousel } from './BudgetKpiCarousel';
import { UpcomingDeadlinesCard } from './UpcomingDeadlinesCard';
import './BudgetKpiGrid.css';

export function BudgetKpiGrid({
  discretionaryMargin = 0,
  monthlyIncome = 0,
  upcomingCount = 0,
  showDiscretionary = true,
  upcomingItems = [],
}) {
  if (!showDiscretionary) {
    return (
      <div className="budget-kpi-container single-card-mode">
        <UpcomingDeadlinesCard items={upcomingItems} />
      </div>
    );
  }

  return (
    <BudgetKpiCarousel
      discretionaryMargin={discretionaryMargin}
      monthlyIncome={monthlyIncome}
      upcomingCount={upcomingCount}
    />
  );
}
