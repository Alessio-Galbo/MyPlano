import React from 'react';
import { PlusCircle } from 'lucide-react';
import { Button } from '../../components/ui';
import { useI18n } from '../../core/i18n';

export function ColdStartDeficitBanner({
  deficitAlert,
  initialBufferRequired = 0,
  onTopUpFund,
  formatCurr,
}) {
  const { t } = useI18n();

  return (
    <div className="cold-start-topup-banner">
      <p className="cold-start-advice">{deficitAlert}</p>
      {onTopUpFund && initialBufferRequired > 0 && (
        <Button
          type="button"
          size="sm"
          variant="secondary"
          icon={<PlusCircle size={14} />}
          onClick={() => onTopUpFund(initialBufferRequired)}
        >
          {t('budget.coldStart.quickTopUpBtn').replace('{amount}', formatCurr(initialBufferRequired))}
        </Button>
      )}
    </div>
  );
}
