import React, { useState } from 'react';
import { AlertTriangle } from 'lucide-react';
import { useI18n } from '../../core/i18n';
import { generateCashflowTimeline } from './budgetCalculations';
import { TimelineHorizonSelector } from './TimelineHorizonSelector';
import './CashflowTimeline.css';

export function CashflowTimeline({
  expenses,
  selectedProfileId,
  initialBalance = 0,
  simOptions = {},
}) {
  const { t } = useI18n();
  const [horizon, setHorizon] = useState(12);
  const timeline = generateCashflowTimeline(
    expenses,
    selectedProfileId,
    horizon,
    initialBalance,
    simOptions
  );

  const formatCurr = (val) =>
    val.toLocaleString('it-IT', { style: 'currency', currency: 'EUR' });

  return (
    <div className="cashflow-container">
      <div className="cashflow-header">
        <div>
          <h3 className="cashflow-title">{t('budget.simulation.title')}</h3>
          <p className="cashflow-subtitle">{t('budget.simulation.subtitle')}</p>
        </div>

        <TimelineHorizonSelector horizon={horizon} onChange={setHorizon} />
      </div>

      <div className="table-wrapper">
        <table className="cashflow-table">
          <thead>
            <tr>
              <th>{t('budget.simulation.month')}</th>
              <th>{t('budget.metrics.monthlyQuota')}</th>
              <th>{t('budget.simulation.outflow')}</th>
              <th>{t('budget.simulation.accumulated')}</th>
            </tr>
          </thead>
          <tbody>
            {timeline.map((m, idx) => (
              <tr key={idx} className={m.isShortage ? 'cashflow-row-shortage' : ''}>
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
                            {de.title} ({formatCurr(de.amount)})
                          </div>
                        ))}
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
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
