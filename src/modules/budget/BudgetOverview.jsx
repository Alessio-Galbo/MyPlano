import React from 'react';
import { useI18n } from '../../core/i18n';
import {
  getBudgetOverviewState,
  performTopUpFund,
  performDepositProfileQuota,
} from './budgetOverviewHelpers';
import { BudgetKpiGrid } from './BudgetKpiGrid';
import { ColdStartCard } from './ColdStartCard';
import { GlobalIncomeHub } from './GlobalIncomeHub';
import { ConsolidatedProfilesGrid } from './ConsolidatedProfilesGrid';
import './BudgetOverview.css';

export function BudgetOverview({
  expenses,
  profiles = [],
  selectedProfileId = 'all',
  onSelectProfile,
  onUpdateProfileBalance,
  onUpdateProfileIncome,
  onDepositProfileQuota,
  coldStart,
  simulationStrategy = 'standard',
  onSelectStrategy,
}) {
  const { t } = useI18n();
  const state = getBudgetOverviewState({
    profiles,
    expenses,
    selectedProfileId,
    simulationStrategy,
    coldStart,
  });

  const { profile, isProfileMode, metrics, totalLiquidity, totalIncome, effectiveQuota, currentIncome, margin } = state;

  const handleTopUpFund = (amount) => {
    const tid = isProfileMode ? selectedProfileId : profiles[0]?.id;
    if (tid) performTopUpFund(profiles, tid, amount, onUpdateProfileBalance, onSelectStrategy);
  };

  const handleDepositQuota = (pId, amount) => {
    performDepositProfileQuota(profiles, pId, amount, onDepositProfileQuota, onUpdateProfileBalance);
  };

  const profileTitle = profile?.name
    ? t('budget.incomeHub.profileHubTitle').replace('{name}', profile.name)
    : undefined;

  return (
    <div className="budget-overview">
      {isProfileMode ? (
        <GlobalIncomeHub
          title={profileTitle}
          initialBalance={profile?.initialBalance || 0}
          onUpdateInitialBalance={(v) => onUpdateProfileBalance?.(selectedProfileId, v)}
          monthlyIncome={profile?.monthlyIncome || 0}
          onUpdateMonthlyIncome={(v) => onUpdateProfileIncome?.(selectedProfileId, v)}
          monthlyQuota={effectiveQuota}
          discretionaryMargin={margin}
        />
      ) : (
        <ConsolidatedProfilesGrid
          profiles={profiles}
          expenses={expenses}
          totalLiquidity={totalLiquidity}
          totalIncome={totalIncome}
          onSelectProfile={onSelectProfile}
          onDepositQuota={handleDepositQuota}
          simulationStrategy={simulationStrategy}
        />
      )}

      <BudgetKpiGrid
        showDiscretionary={!isProfileMode}
        discretionaryMargin={margin}
        monthlyIncome={currentIncome}
        upcomingCount={metrics.upcoming30DaysCount}
      />

      <ColdStartCard
        analysis={coldStart}
        standardMonthlyQuota={metrics.monthlyQuota}
        selectedStrategy={simulationStrategy}
        onSelectStrategy={onSelectStrategy}
        onTopUpFund={handleTopUpFund}
      />
    </div>
  );
}
