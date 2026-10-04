import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useI18n } from '../../core/i18n';
import { useCarousel } from '../../hooks/useCarousel';
import { ConsolidatedUpcomingCard } from './ConsolidatedUpcomingCard';
import { ConsolidatedDiscretionaryCard } from './ConsolidatedDiscretionaryCard';

export function BudgetKpiCarousel({
  discretionaryMargin = 0,
  monthlyIncome = 0,
  upcomingItems = [],
  profiles = [],
  onOpenNotificationCenter,
}) {
  const { t } = useI18n();
  const { activeIdx, setActiveIdx, next, prev, touchHandlers } = useCarousel(2);

  return (
    <div className="budget-kpi-container">
      <div className="budget-kpi-carousel-wrapper">
        <div className="budget-kpi-track-window" {...touchHandlers}>
          <div
            className="budget-kpi-track"
            style={{ transform: `translateX(-${activeIdx * 100}%)` }}
          >
            <ConsolidatedUpcomingCard
              items={upcomingItems}
              profiles={profiles}
              onOpenNotificationCenter={onOpenNotificationCenter}
            />
            <ConsolidatedDiscretionaryCard
              discretionaryMargin={discretionaryMargin}
              monthlyIncome={monthlyIncome}
            />
          </div>
        </div>
      </div>

      <div className="kpi-carousel-nav">
        <button
          type="button"
          className="kpi-carousel-arrow left"
          onClick={prev}
          aria-label={t('common.actions.previous')}
        >
          <ChevronLeft size={14} />
        </button>

        <div className="kpi-carousel-dots">
          <button
            type="button"
            className={`carousel-dot ${activeIdx === 0 ? 'active' : ''}`}
            onClick={() => setActiveIdx(0)}
            aria-label={t('common.actions.slideN', { n: 1 })}
          />
          <button
            type="button"
            className={`carousel-dot ${activeIdx === 1 ? 'active' : ''}`}
            onClick={() => setActiveIdx(1)}
            aria-label={t('common.actions.slideN', { n: 2 })}
          />
        </div>

        <button
          type="button"
          className="kpi-carousel-arrow right"
          onClick={next}
          aria-label={t('common.actions.next')}
        >
          <ChevronRight size={14} />
        </button>
      </div>
    </div>
  );
}
