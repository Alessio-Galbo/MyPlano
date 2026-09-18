import React from 'react';
import { Wallet, DollarSign } from 'lucide-react';
import { useI18n } from '../../core/i18n';
import { ValueSaveBox } from './ValueSaveBox';
import { DepositQuotaButton } from './DepositQuotaButton';
import './IncomeOverviewCard.css';

export function GlobalIncomeHub({
  title,
  initialBalance = 0,
  onUpdateInitialBalance,
  monthlyIncome = 0,
  onUpdateMonthlyIncome,
  monthlyQuota = 0,
}) {
  const { t } = useI18n();
  const displayTitle = title || t('budget.incomeHub.globalHubTitle');

  const handleDeposit = (amount) => {
    const cur = Number(initialBalance) || 0;
    const next = Math.round((cur + amount) * 100) / 100;
    onUpdateInitialBalance(next);
  };

  return (
    <div className="income-hub-card global-hub-card">
      <div className="income-hub-header">
        <h4 className="income-hub-title">{displayTitle}</h4>
      </div>

      <div className="income-inputs-grid">
        <ValueSaveBox
          icon={<Wallet size={24} className="income-box-icon" />}
          label={t('budget.incomeHub.mainFund')}
          value={initialBalance}
          onSave={onUpdateInitialBalance}
          saveButtonText={t('budget.incomeHub.saveBalance')}
          extraAction={
            monthlyQuota > 0 ? (
              <DepositQuotaButton monthlyQuota={monthlyQuota} onDeposit={handleDeposit} />
            ) : null
          }
        />

        <ValueSaveBox
          icon={<DollarSign size={24} className="income-box-icon" />}
          label={t('budget.incomeHub.monthlyIncome')}
          value={monthlyIncome}
          onSave={onUpdateMonthlyIncome}
          saveButtonText={t('budget.incomeHub.saveIncome')}
          placeholder={t('budget.incomeHub.optional')}
        />
      </div>
    </div>
  );
}
