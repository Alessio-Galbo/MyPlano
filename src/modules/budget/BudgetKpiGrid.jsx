import React from 'react';
import { ShieldCheck, Calendar, TrendingUp } from 'lucide-react';
import { useI18n } from '../../core/i18n';

export function BudgetKpiGrid({ metrics }) {
  const { t } = useI18n();
  const formatCurr = (val) =>
    Number(val || 0).toLocaleString('it-IT', { style: 'currency', currency: 'EUR' });

  return (
    <div className="kpi-grid">
      <div className="kpi-card kpi-card-highlight">
        <div className="kpi-header">
          <span className="kpi-label">{t('budget.metrics.monthlyQuota')}</span>
          <div className="kpi-icon"><ShieldCheck size={20} /></div>
        </div>
        <div className="kpi-value text-gradient">
          {formatCurr(metrics.monthlyQuota)}
          <small className="text-subtle">/mese</small>
        </div>
        <span className="kpi-desc">
          {t('budget.metrics.monthlyQuotaDesc')}
        </span>
      </div>

      <div className="kpi-card">
        <div className="kpi-header">
          <span className="kpi-label">{t('budget.metrics.totalAnnual')}</span>
          <div className="kpi-icon"><TrendingUp size={20} /></div>
        </div>
        <div className="kpi-value">{formatCurr(metrics.totalAnnual)}</div>
        <span className="kpi-desc">
          {metrics.filteredCount} {t('budget.metrics.activeExpensesCount')}
        </span>
      </div>

      <div className="kpi-card">
        <div className="kpi-header">
          <span className="kpi-label">{t('budget.metrics.upcoming30Days')}</span>
          <div className="kpi-icon"><Calendar size={20} /></div>
        </div>
        <div className="kpi-value">{metrics.upcoming30DaysCount}</div>
        <span className="kpi-desc">{t('budget.metrics.upcoming30Days')}</span>
      </div>
    </div>
  );
}
