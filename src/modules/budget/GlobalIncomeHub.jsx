import React from 'react';
import { Wallet, TrendingUp } from 'lucide-react';
import { useI18n } from '../../core/i18n';
import { formatCurrency } from '../expenses/expenseHelpers';
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
  discretionaryMargin = 0,
}) {
  const { t } = useI18n();
  const displayTitle = title || t('budget.incomeHub.globalHubTitle');
  const hasIncome = Number(monthlyIncome) > 0;

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
          icon={<Wallet size={18} />}
          label={t('budget.incomeHub.mainFund')}
          shortLabel={t('budget.incomeHub.fundShort')}
          value={initialBalance}
          onSave={onUpdateInitialBalance}
          footer={
            monthlyQuota > 0 ? (
              <DepositQuotaButton monthlyQuota={monthlyQuota} onDeposit={handleDeposit} />
            ) : null
          }
        />

        <ValueSaveBox
          icon={<TrendingUp size={18} />}
          label={t('budget.incomeHub.monthlyIncome')}
          shortLabel={t('budget.incomeHub.incomeShort')}
          value={monthlyIncome}
          onSave={onUpdateMonthlyIncome}
          placeholder={t('budget.incomeHub.optional')}
          footer={
            <div className="income-discretionary-footer">
              <span className="income-discretionary-label">
                <span className="disc-label-full">{t('budget.metrics.residualDiscretionary')}</span>
                <span className="disc-label-short">{t('budget.incomeHub.discretionaryShort')}</span>
              </span>
              <span className="income-discretionary-val text-gradient">
                {hasIncome ? formatCurrency(discretionaryMargin) : '—'}
                {hasIncome && <small className="income-discretionary-unit">/m</small>}
              </span>
            </div>
          }
        />
      </div>
    </div>
  );
}
