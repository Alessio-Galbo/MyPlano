import React from 'react';
import { AlertTriangle, Clock } from 'lucide-react';
import { useI18n } from '../../core/i18n';
import './CashflowGroupedRow.css';

export function CashflowGroupedRow({ item }) {
  const { t } = useI18n();
  const formatCurr = (val) =>
    Number(val || 0).toLocaleString('it-IT', { style: 'currency', currency: 'EUR' });

  const durationText = item.isSingleMonth
    ? t('budget.simulation.interimPeriod')
    : t('budget.simulation.monthsCount').replace('{count}', item.monthsCount);

  return (
    <tr className={`cashflow-row-grouped ${item.isShortage ? 'cashflow-row-shortage' : ''}`}>
      <td>
        {item.isSingleMonth ? (
          <div className="timeline-grouped-month">
            <Clock size={13} className="timeline-grouped-icon" />
            <span>{item.fromMonthLabel}</span>
            <span className="timeline-grouped-badge">{durationText}</span>
          </div>
        ) : (
          <div className="timeline-elbow-range">
            <div className="timeline-elbow-line" aria-hidden="true" />
            <div className="timeline-elbow-dates">
              <span className="timeline-elbow-start">{item.fromMonthLabel}</span>
              <div className="timeline-elbow-end">
                <span>{item.toMonthLabel}</span>
                <span className="timeline-grouped-badge">{durationText}</span>
              </div>
            </div>
          </div>
        )}
      </td>
      <td>
        <span className="val-positive">+{formatCurr(item.quota)}</span>
        <div className="timeline-due-item text-subtle">
          <em>{t('budget.simulation.accumulatedQuotaPeriod')}</em>
        </div>
      </td>
      <td>
        {item.outflow > 0 ? (
          <div>
            <span className="val-negative">-{formatCurr(item.outflow)}</span>
            <div className="timeline-due-item timeline-excluded-delta">
              <em>{t('budget.simulation.otherOutflowPeriod')}</em>
            </div>
          </div>
        ) : (
          '€ 0,00'
        )}
      </td>
      <td>
        <span className={item.reserve >= 0 ? 'val-positive' : 'val-negative'}>
          {formatCurr(item.reserve)}
        </span>
        {item.isShortage && (
          <AlertTriangle
            size={14}
            className="val-negative"
            title={t('budget.simulation.warningShortage')}
          />
        )}
      </td>
    </tr>
  );
}
