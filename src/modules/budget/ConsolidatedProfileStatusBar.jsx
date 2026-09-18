import React from 'react';
import { AlertTriangle, CheckCircle2 } from 'lucide-react';
import { useI18n } from '../../core/i18n';

export function ConsolidatedProfileStatusBar({ analysis, formatCurr }) {
  const { t } = useI18n();
  const monthName = analysis.worstMonth
    ? `${analysis.worstMonth.monthNameKey} ${analysis.worstMonth.year}`
    : '';

  return (
    <div className={`consolidated-status-bar ${analysis.hasDeficit ? 'status-danger' : 'status-safe'}`}>
      {analysis.hasDeficit ? (
        <div className="status-content">
          <div className="status-main-alert">
            <AlertTriangle size={15} />
            <span>
              {t('budget.overview.statusDeficitDesc')
                .replace('{amount}', formatCurr(analysis.maxDeficit))
                .replace('{month}', monthName)}
            </span>
          </div>
          <span className="status-rescue-hint">
            {t('budget.overview.rescueBuffer').replace('{amount}', formatCurr(analysis.initialBufferRequired))}
          </span>
        </div>
      ) : (
        <div className="status-content">
          <div className="status-main-alert">
            <CheckCircle2 size={15} />
            <span>
              {t('budget.overview.statusSafeDesc').replace('{amount}', formatCurr(analysis.safetyMargin))}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
