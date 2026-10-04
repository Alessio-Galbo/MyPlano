import React from 'react';
import { useI18n, formatCurrency } from '../../core/i18n';
import './DiscretionaryMarginPanel.css';

export function DiscretionaryMarginPanel({ monthlyIncome, safeMonthlyQuota }) {
  const { t } = useI18n();
  const incomeNum = parseFloat(monthlyIncome) || 0;

  if (incomeNum <= 0) return null;

  const discretionary = Math.max(0, incomeNum - safeMonthlyQuota);
  const formatCurr = (v) =>
    formatCurrency(v);

  return (
    <div className="discretionary-panel">
      <div>
        <div className="discretionary-label">{t('budget.incomeHub.discretionaryTitle')}</div>
        <div className="discretionary-desc">{t('budget.incomeHub.discretionaryDesc')}</div>
      </div>
      <div className="discretionary-amount">{formatCurr(discretionary)}</div>
    </div>
  );
}
