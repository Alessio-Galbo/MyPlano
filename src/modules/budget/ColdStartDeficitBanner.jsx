import React from 'react';
import { PlusCircle, Zap } from 'lucide-react';
import { Button } from '../../components/ui';
import { useI18n } from '../../core/i18n';

export function ColdStartDeficitBanner({
  deficitAlert,
  initialBufferRequired = 0,
  onTopUpFund,
  formatCurr,
  onSelectStrategy,
  standardAmountFormatted,
  survivalAmountFormatted,
}) {
  const { t } = useI18n();

  const renderContent = () => {
    if (!deficitAlert) return null;
    if (typeof deficitAlert === 'string') return deficitAlert;
    const { rawTemplate, replacements } = deficitAlert;
    if (!rawTemplate || !replacements) return deficitAlert.alert || null;

    const regex = /(\{firstMonth\}|\{worstMonth\}|\{month\}|\{amount\}|\{expenses\})/g;
    const parts = rawTemplate.split(regex);

    return parts.map((part, idx) => {
      if (part === '{amount}') {
        return <strong key={idx} className="val-negative">{replacements[part]}</strong>;
      }
      if (['{firstMonth}', '{worstMonth}', '{month}', '{expenses}'].includes(part)) {
        return <strong key={idx}>{replacements[part]}</strong>;
      }
      return part;
    });
  };

  const planBLabel = standardAmountFormatted && survivalAmountFormatted
    ? t('budget.coldStart.planBCompare')
        .replace('{standard}', standardAmountFormatted)
        .replace('{survival}', survivalAmountFormatted)
    : t('budget.coldStart.activatePlanB');

  return (
    <div className="cold-start-topup-banner">
      <div className="cold-start-banner-content">
        <p className="cold-start-advice">{renderContent()}</p>
      </div>
      <div className="cold-start-topup-action">
        {onTopUpFund && initialBufferRequired > 0 && (
          <Button
            type="button"
            size="sm"
            variant="secondary"
            className="topup-action-btn"
            icon={<PlusCircle size={15} />}
            onClick={() => onTopUpFund(initialBufferRequired)}
          >
            {t('budget.coldStart.quickTopUpBtn').replace('{amount}', formatCurr(initialBufferRequired))}
          </Button>
        )}
        {onSelectStrategy && survivalAmountFormatted && (
          <Button
            type="button"
            size="sm"
            variant="outline"
            className="plan-b-action-btn"
            icon={<Zap size={14} />}
            onClick={() => onSelectStrategy('survival')}
          >
            {planBLabel}
          </Button>
        )}
      </div>
    </div>
  );
}
