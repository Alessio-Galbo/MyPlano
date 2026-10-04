import React from 'react';
import { Layers } from 'lucide-react';
import { useI18n, formatCurrency } from '../../core/i18n';
import './ConsolidatedOverview.css';

export function ConsolidatedOverviewCard({
  totalLiquidity = 0,
  totalIncome = 0,
  totalMonthlyQuota = 0,
}) {
  const { t } = useI18n();
  const formatCurr = (v) =>
    formatCurrency(v);

  const totalMargin = Math.round((totalIncome - totalMonthlyQuota) * 100) / 100;

  return (
    <div className="consolidated-macro-card">
      <div className="consolidated-macro-header">
        <div className="consolidated-title-group">
          <div className="consolidated-macro-badge">
            <Layers size={16} />
            <span>{t('budget.overview.title')}</span>
          </div>
          <p className="consolidated-macro-subtitle">{t('budget.overview.subtitle')}</p>
        </div>
      </div>

      <div className="consolidated-metrics-row">
        <div className="consolidated-metric-box">
          <span className="consolidated-metric-label">{t('budget.overview.totalLiquidity')}</span>
          <strong className="consolidated-metric-val val-primary">{formatCurr(totalLiquidity)}</strong>
        </div>

        <div className="consolidated-metric-box">
          <span className="consolidated-metric-label">{t('budget.overview.totalIncome')}</span>
          <strong className="consolidated-metric-val">{formatCurr(totalIncome)}</strong>
        </div>

        <div className="consolidated-metric-box">
          <span className="consolidated-metric-label">{t('budget.metrics.monthlyQuota')}</span>
          <strong className="consolidated-metric-val val-warning">{formatCurr(totalMonthlyQuota)}</strong>
        </div>

        <div className="consolidated-metric-box">
          <span className="consolidated-metric-label">{t('budget.incomeHub.discretionaryTitle')}</span>
          <strong className={`consolidated-metric-val ${totalMargin >= 0 ? 'val-positive' : 'val-negative'}`}>
            {formatCurr(totalMargin)}
          </strong>
        </div>
      </div>
    </div>
  );
}
