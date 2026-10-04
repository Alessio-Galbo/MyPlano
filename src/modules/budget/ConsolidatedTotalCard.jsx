import React from 'react';
import { Layers, CheckCircle2, PlusCircle } from 'lucide-react';
import { Button } from '../../components/ui';
import { useI18n, formatCurrency } from '../../core/i18n';
import { calculateColdStartAnalysis } from './budgetCalculations';
import './ConsolidatedProfileCard.css';
import './ConsolidatedTotalCard.css';

export function ConsolidatedTotalCard({
  profiles = [],
  expenses = [],
  totalLiquidity = 0,
  totalIncome = 0,
  totalMonthlyQuota = 0,
  onOpenDepositAllModal,
  justDeposited = false,
}) {
  const { t } = useI18n();
  const formatCurr = (v) =>
    formatCurrency(v);

  const analysis = calculateColdStartAnalysis(expenses, 'all', totalLiquidity);

  return (
    <div className="consolidated-profile-card consolidated-total-card">
      <div className="consolidated-card-top">
        <div className="profile-identity">
          <Layers size={16} className="total-nucleo-icon" />
          <strong className="profile-card-name">{t('budget.overview.totalCardTitle')}</strong>
        </div>
        <span className="total-profiles-badge">
          {t('budget.overview.allProfilesCount').replace('{count}', String(profiles.length))}
        </span>
      </div>

      <div className="consolidated-card-numbers">
        <div className="card-num-item">
          <span className="card-num-label">{t('budget.overview.minBalanceLabel')}</span>
          <strong className={analysis.hasDeficit ? 'val-negative' : 'val-positive'}>
            {analysis.hasDeficit ? `-${formatCurr(analysis.maxDeficit)}` : `+${formatCurr(analysis.safetyMargin)}`}
          </strong>
        </div>
        <div className="card-num-item">
          <span className="card-num-label">{t('budget.metrics.monthlyQuota')}</span>
          <strong className="val-warning">{formatCurr(totalMonthlyQuota)}</strong>
        </div>
        <div className="card-num-item">
          <span className="card-num-label">{t('budget.overview.monthlyIncomeLabel')}</span>
          <strong>{formatCurr(totalIncome)}</strong>
        </div>
      </div>

      <div className="consolidated-status-bar status-safe">
        <div className="status-main-alert">
          <CheckCircle2 size={15} />
          <span>{t('budget.overview.fundLabel')}: {formatCurr(totalLiquidity)}</span>
        </div>
        {totalMonthlyQuota > 0 && onOpenDepositAllModal && (
          <div className="deposit-quota-container">
            <Button
              type="button"
              variant="secondary"
              size="sm"
              icon={justDeposited ? <CheckCircle2 size={15} className="deposit-success-icon" /> : <PlusCircle size={15} />}
              onClick={onOpenDepositAllModal}
              className={`deposit-quota-btn ${justDeposited ? 'deposited' : ''}`}
            >
              {t('budget.incomeHub.depositQuotaBtn')}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
