import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { ColdStartOptionCard } from './ColdStartOptionCard';
import { useI18n } from '../../core/i18n';
import { useCarousel } from '../../hooks/useCarousel';
import './ColdStartStrategyCarousel.css';

export function ColdStartStrategyCarousel({
  selectedStrategy = 'standard',
  onSelectStrategy,
  standardTitle,
  standardAmountFormatted,
  standardDesc,
  survivalTitle,
  survivalAmountFormatted,
  survivalDesc,
}) {
  const { t } = useI18n();
  const { activeIdx, setActiveIdx, next, prev, touchHandlers } = useCarousel(2);

  return (
    <div className="strategy-carousel-container">
      <div className="strategy-carousel-wrapper">
        <button
          type="button"
          className="strategy-carousel-arrow left"
          onClick={prev}
          aria-label={t('common.actions.previous')}
        >
          <ChevronLeft size={16} />
        </button>

        <div className="strategy-track-window" {...touchHandlers}>
          <div
            className="strategy-track"
            style={{ transform: `translateX(-${activeIdx * 100}%)` }}
          >
            <div className="strategy-slide">
              <ColdStartOptionCard
                id="standard"
                title={standardTitle}
                amountFormatted={standardAmountFormatted}
                isMonthly
                desc={standardDesc}
                isActive={selectedStrategy === 'standard'}
                onClick={onSelectStrategy}
              />
            </div>
            <div className="strategy-slide">
              <ColdStartOptionCard
                id="survival"
                title={survivalTitle}
                amountFormatted={survivalAmountFormatted}
                isMonthly
                desc={survivalDesc}
                isActive={selectedStrategy === 'survival'}
                onClick={onSelectStrategy}
              />
            </div>
          </div>
        </div>

        <button
          type="button"
          className="strategy-carousel-arrow right"
          onClick={next}
          aria-label={t('common.actions.next')}
        >
          <ChevronRight size={16} />
        </button>
      </div>

      <div className="strategy-carousel-dots">
        <button
          type="button"
          className={`carousel-dot ${activeIdx === 0 ? 'active' : ''}`}
          onClick={() => setActiveIdx(0)}
          aria-label={t('budget.coldStart.standardPlanTitle')}
        />
        <button
          type="button"
          className={`carousel-dot ${activeIdx === 1 ? 'active' : ''}`}
          onClick={() => setActiveIdx(1)}
          aria-label={t('budget.coldStart.strategySurvivalAria')}
        />
      </div>
    </div>
  );
}
