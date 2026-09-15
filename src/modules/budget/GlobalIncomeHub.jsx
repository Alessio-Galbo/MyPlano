import React from 'react';
import { Wallet, DollarSign } from 'lucide-react';
import { useI18n } from '../../core/i18n';
import { DiscretionaryMarginPanel } from './DiscretionaryMarginPanel';
import { ValueSaveBox } from './ValueSaveBox';
import './IncomeOverviewCard.css';

export function GlobalIncomeHub({
  initialBalance = 0,
  onUpdateInitialBalance,
  monthlyIncome = 0,
  onUpdateMonthlyIncome,
  safeMonthlyQuota = 0,
}) {
  const { t } = useI18n();

  return (
    <div className="income-hub-card global-hub-card">
      <div className="income-hub-header">
        <h4 className="income-hub-title">{t('budget.incomeHub.globalHubTitle')}</h4>
      </div>

      <div className="income-inputs-grid">
        <ValueSaveBox
          icon={<Wallet size={24} className="income-box-icon" />}
          label={t('budget.incomeHub.mainFund')}
          value={initialBalance}
          onSave={onUpdateInitialBalance}
          saveButtonText={t('budget.incomeHub.saveBalance')}
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

      <DiscretionaryMarginPanel
        monthlyIncome={monthlyIncome}
        safeMonthlyQuota={safeMonthlyQuota}
      />
    </div>
  );
}
