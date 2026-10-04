import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { useI18n, formatCurrency } from '../../core/i18n';

export function CashflowTableRow({ month: m }) {
  const { t } = useI18n();
  const formatCurr = (val) =>
    formatCurrency(val);

  return (
    <tr className={m.isShortage ? 'cashflow-row-shortage' : ''}>
      <td><strong>{m.monthNameKey} {m.year}</strong></td>
      <td>
        {formatCurr(m.quota)}
        {m.isSurvivalQuota && <span className="quota-badge-survival"> (Min)</span>}
      </td>
      <td>
        {m.outflow > 0 ? (
          <div>
            <span className="val-negative">-{formatCurr(m.outflow)}</span>
            <div className="timeline-due-list">
              {m.dueExpenses?.map((de) => (
                <div key={de.id} className="timeline-due-item">
                  {de.dueDates?.length > 0 && `${de.dueDates.map((d) => Number(d.slice(8, 10))).join(', ')} · `}
                  {de.title} ({formatCurr(de.amount)})
                </div>
              ))}
              {m.excludedOutflow > 0 && (
                <div className="timeline-due-item timeline-excluded-delta">
                  <em>{t('budget.simulation.otherFilteredOutflow')} -{formatCurr(m.excludedOutflow)}</em>
                </div>
              )}
            </div>
          </div>
        ) : ('€ 0,00')}
      </td>
      <td>
        <span className={m.reserve >= 0 ? 'val-positive' : 'val-negative'}>
          {formatCurr(m.reserve)}
        </span>
        {m.isShortage && (
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
