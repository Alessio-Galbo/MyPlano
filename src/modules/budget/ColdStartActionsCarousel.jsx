import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useCarousel } from '../../hooks/useCarousel';
import { ColdStartTopUpCard } from './ColdStartTopUpCard';
import { ColdStartPlanBCard } from './ColdStartPlanBCard';
import './ColdStartActionsCarousel.css';

export function ColdStartActionsCarousel({
  topUpAmountFormatted,
  standardQuotaFormatted,
  onTopUpFund,
  planBAmountFormatted,
  planBPhases = [],
  isPlanBActive = false,
  onTogglePlanB,
  t,
}) {
  const { activeIdx, setActiveIdx, next, prev, touchHandlers } = useCarousel(2);

  return (
    <div className="cold-start-actions-container">
      <div className="cold-start-actions-carousel-wrapper">
        <button
          type="button"
          className="actions-carousel-arrow left"
          onClick={prev}
          aria-label={t('common.actions.previous')}
        >
          <ChevronLeft size={16} />
        </button>

        <div className="actions-track-window" {...touchHandlers}>
          <div
            className="actions-track"
            style={{ transform: `translateX(-${activeIdx * 100}%)` }}
          >
            <div className="actions-slide">
              <ColdStartTopUpCard
                amountFormatted={topUpAmountFormatted}
                standardQuotaFormatted={standardQuotaFormatted}
                onTopUp={onTopUpFund}
                t={t}
              />
            </div>
            <div className="actions-slide">
              <ColdStartPlanBCard
                planBAmountFormatted={planBAmountFormatted}
                phasesList={planBPhases}
                isActive={isPlanBActive}
                onToggle={onTogglePlanB}
                t={t}
              />
            </div>
          </div>
        </div>

        <button
          type="button"
          className="actions-carousel-arrow right"
          onClick={next}
          aria-label={t('common.actions.next')}
        >
          <ChevronRight size={16} />
        </button>
      </div>

      <div className="actions-carousel-dots">
        <button
          type="button"
          className={`carousel-dot ${activeIdx === 0 ? 'active' : ''}`}
          onClick={() => setActiveIdx(0)}
          aria-label={t('budget.coldStart.topUpActionTitle')}
        />
        <button
          type="button"
          className={`carousel-dot ${activeIdx === 1 ? 'active' : ''}`}
          onClick={() => setActiveIdx(1)}
          aria-label={t('budget.coldStart.planBShort')}
        />
      </div>
    </div>
  );
}
