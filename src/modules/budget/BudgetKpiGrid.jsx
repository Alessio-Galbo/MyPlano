import React from 'react';
import { Calendar, TrendingUp, ChevronLeft, ChevronRight } from 'lucide-react';
import { useI18n } from '../../core/i18n';
import { useCarousel } from '../../hooks/useCarousel';
import './BudgetKpiGrid.css';

export function BudgetKpiGrid({
  discretionaryMargin = 0,
  monthlyIncome = 0,
  upcomingCount = 0,
}) {
  const { t } = useI18n();
  const { activeIdx, setActiveIdx, next, prev, touchHandlers } = useCarousel(2);

  const formatCurr = (val) =>
    Number(val || 0).toLocaleString('it-IT', { style: 'currency', currency: 'EUR' });

  const hasIncome = Number(monthlyIncome) > 0;

  return (
    <div className="budget-kpi-container">
      <div className="budget-kpi-carousel-wrapper">
        <button
          type="button"
          className="kpi-carousel-arrow left"
          onClick={prev}
          aria-label="Precedente"
        >
          <ChevronLeft size={16} />
        </button>

        <div className="budget-kpi-track-window" {...touchHandlers}>
          <div
            className="budget-kpi-track"
            style={{ transform: `translateX(-${activeIdx * 100}%)` }}
          >
            <div className="kpi-card">
              <div className="kpi-header">
                <span className="kpi-label">{t('budget.metrics.upcomingDeadlines')}</span>
                <div className="kpi-icon"><Calendar size={18} /></div>
              </div>
              <div className="kpi-value">{upcomingCount}</div>
              <span className="kpi-desc">{t('budget.metrics.upcomingDeadlinesDesc')}</span>
            </div>

            <div className="kpi-card kpi-card-highlight">
              <div className="kpi-header">
                <span className="kpi-label">{t('budget.metrics.residualDiscretionary')}</span>
                <div className="kpi-icon"><TrendingUp size={18} /></div>
              </div>
              <div className="kpi-value text-gradient">
                {hasIncome ? formatCurr(discretionaryMargin) : '—'}
                {hasIncome && <small className="text-subtle">/mese</small>}
              </div>
              <span className="kpi-desc">
                {hasIncome ? t('budget.metrics.residualDiscretionaryDesc') : t('budget.incomeHub.optional')}
              </span>
            </div>
          </div>
        </div>

        <button
          type="button"
          className="kpi-carousel-arrow right"
          onClick={next}
          aria-label="Successivo"
        >
          <ChevronRight size={16} />
        </button>
      </div>

      <div className="kpi-carousel-dots">
        <button
          type="button"
          className={`carousel-dot ${activeIdx === 0 ? 'active' : ''}`}
          onClick={() => setActiveIdx(0)}
          aria-label="Card 1"
        />
        <button
          type="button"
          className={`carousel-dot ${activeIdx === 1 ? 'active' : ''}`}
          onClick={() => setActiveIdx(1)}
          aria-label="Card 2"
        />
      </div>
    </div>
  );
}
