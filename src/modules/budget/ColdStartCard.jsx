import React from 'react';
import { useI18n, formatCurrency } from '../../core/i18n';
import { ColdStartSuccessView } from './ColdStartSuccessView';
import { ColdStartDeficitList } from './ColdStartDeficitList';
import { ColdStartActionsCarousel } from './ColdStartActionsCarousel';
import {
  getSurvivalOptionDetails,
  getPlanBPhaseItems,
} from './coldStartCardHelpers';
import './ColdStartCard.css';

export function ColdStartCard({
  analysis,
  standardMonthlyQuota = 0,
  selectedStrategy = 'standard',
  onSelectStrategy,
  onTopUpFund,
}) {
  const { t } = useI18n();
  const formatCurr = (val) =>
    formatCurrency(val);

  const worstMonthLabel = analysis.worstMonth
    ? `${analysis.worstMonth.monthLongName || analysis.worstMonth.monthNameKey} ${analysis.worstMonth.year}`
    : '';

  if (!analysis.hasDeficit) {
    return <ColdStartSuccessView analysis={analysis} worstMonthLabel={worstMonthLabel} />;
  }

  const { amountFormatted: survivalAmountFormatted } =
    getSurvivalOptionDetails(analysis, worstMonthLabel, t, formatCurr);
  const planBPhases = getPlanBPhaseItems(analysis, worstMonthLabel, t, formatCurr);

  const handleTogglePlanB = () => {
    const nextStrategy = selectedStrategy === 'survival' ? 'standard' : 'survival';
    onSelectStrategy(nextStrategy);
  };

  const handleTopUp = () => {
    onTopUpFund(analysis.initialBufferRequired);
  };

  return (
    <div className="cold-start-card cold-start-warning">

      <ColdStartDeficitList
        standardMonthlyQuota={standardMonthlyQuota}
        analysis={analysis}
        worstMonthLabel={worstMonthLabel}
        formatCurr={formatCurr}
        isStandardActive={selectedStrategy === 'standard'}
        onSelectStandard={() => onSelectStrategy('standard')}
        t={t}
      />

      <ColdStartActionsCarousel
        topUpAmountFormatted={formatCurr(analysis.initialBufferRequired)}
        standardQuotaFormatted={formatCurr(standardMonthlyQuota)}
        onTopUpFund={handleTopUp}
        planBAmountFormatted={survivalAmountFormatted}
        planBPhases={planBPhases}
        isPlanBActive={selectedStrategy === 'survival'}
        onTogglePlanB={handleTogglePlanB}
        t={t}
      />
    </div>
  );
}
