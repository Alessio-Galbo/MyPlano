import React from 'react';
import { ShieldAlert } from 'lucide-react';
import { useI18n } from '../../core/i18n';
import { ColdStartSuccessView } from './ColdStartSuccessView';
import { ColdStartOptionCard } from './ColdStartOptionCard';
import { ColdStartDeficitBanner } from './ColdStartDeficitBanner';
import { getSurvivalOptionDetails, getDeficitAlertTexts } from './coldStartCardHelpers';
import './ColdStartCard.css';

export function ColdStartCard({
  analysis,
  standardMonthlyQuota = 0,
  selectedStrategy = 'survival',
  onSelectStrategy,
  onTopUpFund,
}) {
  const { t } = useI18n();
  const formatCurr = (val) =>
    Number(val || 0).toLocaleString('it-IT', { style: 'currency', currency: 'EUR' });

  const worstMonthLabel = analysis.worstMonth
    ? `${analysis.worstMonth.monthNameKey} ${analysis.worstMonth.year}`
    : '';

  if (!analysis.hasDeficit) {
    return <ColdStartSuccessView analysis={analysis} worstMonthLabel={worstMonthLabel} />;
  }

  const { title: deficitTitle, alert: deficitAlert } = getDeficitAlertTexts(
    analysis,
    worstMonthLabel,
    t,
    formatCurr
  );

  const { amountFormatted: survivalAmountFormatted, desc: survivalDesc } =
    getSurvivalOptionDetails(analysis, worstMonthLabel, t, formatCurr);

  const optStdDesc = t('budget.coldStart.solutionStandardDesc')
    .replace('{amount}', formatCurr(standardMonthlyQuota));

  return (
    <div className="cold-start-card cold-start-warning">
      <div className="cold-start-header">
        <ShieldAlert size={20} className="val-negative" />
        <h4 className="cold-start-title">{deficitTitle}</h4>
      </div>

      <ColdStartDeficitBanner
        deficitAlert={deficitAlert}
        initialBufferRequired={analysis.initialBufferRequired}
        onTopUpFund={onTopUpFund}
        formatCurr={formatCurr}
      />

      <span className="cold-start-section-subtitle">
        {t('budget.coldStart.chartStrategiesTitle')}
      </span>

      <div className="cold-start-grid cold-start-dual-grid">
        <ColdStartOptionCard
          id="survival"
          title={t('budget.coldStart.solutionTwoTitle')}
          amountFormatted={survivalAmountFormatted}
          isMonthly
          desc={survivalDesc}
          isActive={selectedStrategy === 'survival'}
          onClick={onSelectStrategy}
        />
        <ColdStartOptionCard
          id="standard"
          title={t('budget.coldStart.solutionStandardTitle')}
          amountFormatted={formatCurr(standardMonthlyQuota)}
          isMonthly
          desc={optStdDesc}
          isActive={selectedStrategy === 'standard'}
          onClick={onSelectStrategy}
        />
      </div>
    </div>
  );
}
