import React from 'react';
import { Calendar } from 'lucide-react';
import { useI18n } from '../../core/i18n';
import { BudgetKpiCarousel } from './BudgetKpiCarousel';
import './BudgetKpiGrid.css';

export function BudgetKpiGrid({
  discretionaryMargin = 0,
  monthlyIncome = 0,
  upcomingCount = 0,
  showDiscretionary = true,
}) {
  const { t } = useI18n();

  if (!showDiscretionary) {
    return (
      <div className="budget-kpi-container single-card-mode">
        <div className="kpi-card">
          <div className="kpi-header">
            <span className="kpi-label">{t('budget.metrics.upcomingDeadlines')}</span>
            <div className="kpi-icon"><Calendar size={18} /></div>
          </div>
          <div className="kpi-value">{upcomingCount}</div>
          <span className="kpi-desc">{t('budget.metrics.upcomingDeadlinesDesc')}</span>
        </div>
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
