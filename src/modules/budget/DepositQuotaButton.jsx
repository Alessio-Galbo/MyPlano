import React, { useState } from 'react';
import { PlusCircle, CheckCircle2 } from 'lucide-react';
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

  const btnLabel = isAll
    ? (showAmount
        ? `${t('budget.incomeHub.depositAllQuotasBtn')} (+${formatCurr(monthlyQuota)})`
        : t('budget.incomeHub.depositAllQuotasBtn'))
    : (showAmount
        ? `${t('budget.incomeHub.depositQuotaBtn')} (+${formatCurr(monthlyQuota)})`
        : t('budget.incomeHub.depositQuotaBtn'));

  return (
    <div className="deposit-quota-container">
      <Button
        type="button"
        variant="secondary"
        size="sm"
        icon={justDeposited ? <CheckCircle2 size={15} className="deposit-success-icon" /> : <PlusCircle size={15} />}
        onClick={handleClick}
        className={`deposit-quota-btn ${justDeposited ? 'deposited' : ''}`}
      >
        {btnLabel}
      </Button>
    </div>
  );
}
