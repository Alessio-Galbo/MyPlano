import React from 'react';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import { useI18n, formatCurrency } from '../../core/i18n';
import { storageService } from '../../core/storage/storageService';
import { calculateBudgetMetrics, calculateColdStartAnalysis } from './budgetCalculations';
import { ensureProfileClass } from '../../core/theme/dynamicThemeService';
import { DepositQuotaButton } from './DepositQuotaButton';
import './ConsolidatedProfileCard.css';

export function ConsolidatedProfileCard({
  profile,
  colorIndex = 0,
  expenses,
  onSelectProfile,
  onDepositQuota,
  simulationStrategy = 'standard',
}) {
  const { t } = useI18n();
  const formatCurr = (v) =>
    formatCurrency(v);

  const metrics = calculateBudgetMetrics(expenses, profile.id);
  const analysis = calculateColdStartAnalysis(expenses, profile.id, profile.initialBalance);
  const themeClass = ensureProfileClass(profile?.id, colorIndex);

  const activeStrategy = storageService.getProfileStrategy(profile.id) || simulationStrategy;
  const isPianoB = activeStrategy === 'survival' && analysis.hasDeficit;
  const effectiveMonthlyQuota = isPianoB ? analysis.catchUpMonthlyQuota : metrics.monthlyQuota;

  return (
    <div className="consolidated-profile-card">
      <div className="consolidated-card-top">
        <div className="profile-identity">
          <span className={`dynamic-color-dot ${themeClass}`} />
          <strong className="profile-card-name">{profile.name}</strong>
        </div>
        <button
          type="button"
          className="consolidated-open-btn"
          onClick={() => onSelectProfile(profile.id)}
          title={t('budget.overview.switchToProfile')}
        >
          <span>{t('budget.overview.switchToProfile')}</span>
          <ArrowRight size={13} />
        </button>
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
          <strong className="val-warning">{formatCurr(effectiveMonthlyQuota)}</strong>
        </div>
        <div className="card-num-item">
          <span className="card-num-label">{t('budget.overview.monthlyIncomeLabel')}</span>
          <strong>{formatCurr(profile.monthlyIncome)}</strong>
        </div>
      </div>

      <div className="consolidated-status-bar status-safe">
        <div className="status-main-alert">
          <CheckCircle2 size={15} />
          <span>{t('budget.overview.fundLabel')}: {formatCurr(profile.initialBalance)}</span>
        </div>
        {effectiveMonthlyQuota > 0 && onDepositQuota && (
          <DepositQuotaButton
            monthlyQuota={effectiveMonthlyQuota}
            onDeposit={() => onDepositQuota(profile.id, effectiveMonthlyQuota)}
            showAmount={false}
          />
        )}
      </div>
    </div>
  );
}
