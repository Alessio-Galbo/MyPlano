import React from 'react';
import { TrendingUp } from 'lucide-react';
import { useI18n } from '../../core/i18n';
import { formatCurrency } from '../expenses/expenseHelpers';

export function ConsolidatedDiscretionaryCard({
  discretionaryMargin = 0,
  monthlyIncome = 0,
}) {
  const { t } = useI18n();
  const hasIncome = Number(monthlyIncome) > 0;

  return (
    <div className="kpi-card kpi-card-highlight">
      <div className="kpi-header">
        <span className="kpi-label">{t('budget.metrics.residualDiscretionary')}</span>
        <div className="kpi-icon"><TrendingUp size={18} /></div>
      </div>
      <div className="kpi-value text-gradient">
        {hasIncome ? formatCurrency(discretionaryMargin) : '—'}
        {hasIncome && <small className="text-subtle">{t('expenses.viewMode.perMonth')}</small>}
      </div>
      <span className="kpi-desc">
        {hasIncome ? t('budget.metrics.residualDiscretionaryDesc') : t('budget.incomeHub.optional')}
      </span>
    </div>
  );
}
