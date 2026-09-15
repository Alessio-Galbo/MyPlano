import React from 'react';
import { CheckCircle2 } from 'lucide-react';
import { useI18n } from '../../core/i18n';

export function ColdStartSuccessView({ analysis, worstMonthLabel }) {
  const { t } = useI18n();
  const formatCurr = (val) =>
    Number(val || 0).toLocaleString('it-IT', { style: 'currency', currency: 'EUR' });

  const marginDesc = t('budget.coldStart.safetyMarginDesc')
    .replace('{month}', worstMonthLabel)
    .replace('{amount}', formatCurr(analysis.safetyMargin));

  return (
    <div className="cold-start-card cold-start-success">
      <div className="cold-start-header">
        <CheckCircle2 size={20} className="val-positive" />
        <h4 className="cold-start-title">{t('budget.coldStart.fullyCoveredTitle')}</h4>
      </div>
      <div className="cold-start-grid">
        <div className="cold-start-metric">
          <span className="cold-start-metric-label">{t('budget.coldStart.criticalMonthLabel')}</span>
          <span className="cold-start-metric-value">{worstMonthLabel}</span>
        </div>
        <div className="cold-start-metric">
          <span className="cold-start-metric-label">{t('budget.coldStart.safetyMarginLabel')}</span>
          <span className="cold-start-metric-value val-positive">+{formatCurr(analysis.safetyMargin)}</span>
        </div>
      </div>
      <p className="cold-start-advice">🛡️ {marginDesc}</p>
    </div>
  );
}
