import React from 'react';
import { Calendar, Check, ShieldAlert } from 'lucide-react';
import './ColdStartDeficitList.css';

export function ColdStartDeficitList({
  standardMonthlyQuota = 0,
  analysis,
  worstMonthLabel,
  formatCurr,
  isStandardActive = true,
  onSelectStandard,
  t,
}) {
  const firstMonth = analysis.firstDeficitMonth;
  const firstMonthLabel = firstMonth
    ? `${firstMonth.monthLongName || firstMonth.monthNameKey} ${firstMonth.year}`
    : worstMonthLabel;

  const isProgressive = firstMonthLabel && worstMonthLabel && firstMonthLabel !== worstMonthLabel;
  const expensesSummary = analysis.worstMonth?.dueExpenses?.map((e) => e.title).join(', ') || '';
  const expenseSuffix = expensesSummary ? ` (${expensesSummary})` : '';

  return (
    <div className={`standard-plan-card ${isStandardActive ? 'card-active' : ''}`}>
      <div className="action-card-header">
        <div className="action-card-badge standard-plan-badge">
          <Calendar size={14} />
          <span>{t('budget.coldStart.standardPlanTitle')}</span>
        </div>
        <button
          type="button"
          className={`standard-status-pill ${isStandardActive ? 'status-active' : ''}`}
          onClick={onSelectStandard}
          aria-label={t('budget.coldStart.standardActive')}
        >
          {isStandardActive ? (
            <>
              <Check size={12} strokeWidth={3} />
              <span>{t('budget.coldStart.standardActive')}</span>
            </>
          ) : (
            <span>{t('budget.coldStart.activateStandard')}</span>
          )}
        </button>
      </div>

      <div className="standard-plan-value">
        {formatCurr(standardMonthlyQuota)} <small className="text-subtle">{t('expenses.viewMode.perMonth')}</small>
      </div>

      <div className="deficit-shield-notice">
        <div className="deficit-shield-header">
          <ShieldAlert size={14} className="val-negative" />
          <span>{t('budget.coldStart.deficitFollowStandardPrefix')}</span>
        </div>
        <ul className="deficit-bullet-list">
          {isProgressive ? (
            <>
              <li>
                {t('budget.coldStart.deficitFirstShortage')}{' '}
                <strong>{firstMonthLabel}</strong>
              </li>
              <li>
                {t('budget.coldStart.deficitPeakIntro')}{' '}
                <strong><span className="val-negative">{formatCurr(analysis.maxDeficit)}</span></strong>{' '}
                {t('budget.coldStart.deficitAtMonth')}{' '}
                <strong>{worstMonthLabel}</strong>
                {expenseSuffix}
              </li>
            </>
          ) : (
            <>
              <li>
                {t('budget.coldStart.deficitSingleShortage')}{' '}
                <strong>{worstMonthLabel}</strong>
                {expenseSuffix}
              </li>
              <li>
                {t('budget.coldStart.deficitSingleAmount')}{' '}
                <strong><span className="val-negative">{formatCurr(analysis.maxDeficit)}</span></strong>
              </li>
            </>
          )}
        </ul>
      </div>
    </div>
  );
}

