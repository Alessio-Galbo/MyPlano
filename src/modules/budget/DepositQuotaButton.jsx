import React, { useState } from 'react';
import { Plus, Check } from 'lucide-react';
import { Button } from '../../components/ui';
import { useI18n } from '../../core/i18n';
import './DepositQuotaButton.css';

export function DepositQuotaButton({
  monthlyQuota = 0,
  onDeposit,
  isAll = false,
  showAmount = true,
}) {
  const { t } = useI18n();
  const [justDeposited, setJustDeposited] = useState(false);

  if (!monthlyQuota || monthlyQuota <= 0) return null;

  const formatCurr = (v) =>
    Number(v || 0).toLocaleString('it-IT', { style: 'currency', currency: 'EUR' });

  const handleClick = () => {
    onDeposit(monthlyQuota);
    setJustDeposited(true);
    setTimeout(() => setJustDeposited(false), 2500);
  };

  const renderLabel = () => {
    const formattedAmount = formatCurr(monthlyQuota);
    if (isAll) {
      return showAmount
        ? `${t('budget.incomeHub.depositAllQuotasBtn')} (+${formattedAmount})`
        : t('budget.incomeHub.depositAllQuotasBtn');
    }
    if (!showAmount) return t('budget.incomeHub.depositQuotaBtn');
    return (
      <>
        <span className="deposit-label-full">{t('budget.incomeHub.depositQuotaBtn')} (+{formattedAmount})</span>
        <span className="deposit-label-short">{t('budget.incomeHub.depositShort')} (+{formattedAmount})</span>
      </>
    );
  };

  return (
    <div className="deposit-quota-container">
      <Button
        type="button"
        variant="secondary"
        size="sm"
        icon={
          justDeposited ? (
            <Check size={15} strokeWidth={2.5} className="deposit-success-icon" />
          ) : (
            <Plus size={15} strokeWidth={2.5} className="deposit-plus-icon" />
          )
        }
        onClick={handleClick}
        className={`deposit-quota-btn ${justDeposited ? 'deposited' : ''}`}
      >
        {renderLabel()}
      </Button>
    </div>
  );
}
