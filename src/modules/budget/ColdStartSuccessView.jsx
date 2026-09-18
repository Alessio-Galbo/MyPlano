import React from 'react';
import { CheckCircle2 } from 'lucide-react';
import { useI18n } from '../../core/i18n';

export function ColdStartSuccessView({ analysis, worstMonthLabel }) {
  const { t } = useI18n();
  const formatCurr = (val) =>
    Number(val || 0).toLocaleString('it-IT', { style: 'currency', currency: 'EUR' });

  const rawDesc = t('budget.coldStart.safetyMarginDesc');
  const parts = rawDesc.split(/(\{month\}|\{amount\})/g);

  return (
    <div className="cold-start-card cold-start-success cold-start-success-compact">
      <div className="cold-start-header">
        <CheckCircle2 size={18} className="val-positive" />
        <h4 className="cold-start-title">{t('budget.coldStart.fullyCoveredTitle')}</h4>
      </div>
      <p className="cold-start-advice">
        🛡️{' '}
        {parts.map((part, idx) => {
          if (part === '{month}') return <strong key={idx}>{worstMonthLabel}</strong>;
          if (part === '{amount}') {
            return (
              <strong key={idx} className="val-positive">
                +{formatCurr(analysis.safetyMargin)}
              </strong>
            );
          }
          return part;
        })}
      </p>
    </div>
  );
}
