import React from 'react';
import { useI18n } from '../../core/i18n';
import { calculateBudgetMetrics } from './budgetCalculations';
import {
  calculateDiscretionaryMargin,
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
  const profile = profiles.find((p) => p.id === selectedProfileId);
  const isProfileMode = selectedProfileId !== 'all';
  const metrics = calculateBudgetMetrics(expenses, selectedProfileId);

  const totalLiquidity = profiles.reduce((s, p) => s + (Number(p.initialBalance) || 0), 0);
  const totalIncome = profiles.reduce((s, p) => s + (Number(p.monthlyIncome) || 0), 0);
  const isSurvivalActive = simulationStrategy === 'survival' && coldStart?.hasDeficit;
  const effectiveQuota = isSurvivalActive ? coldStart.catchUpMonthlyQuota : metrics.monthlyQuota;

  const handleTopUpFund = (amount) => {
    const targetId = isProfileMode ? selectedProfileId : profiles[0]?.id;
    if (targetId) performTopUpFund(profiles, targetId, amount, onUpdateProfileBalance, onSelectStrategy);
  };

  const handleDepositProfileQuota = (pId, amount) => {
    performDepositProfileQuota(profiles, pId, amount, onDepositProfileQuota, onUpdateProfileBalance);
  };

  const currentIncome = isProfileMode ? (profile?.monthlyIncome || 0) : totalIncome;
  const margin = calculateDiscretionaryMargin(currentIncome, effectiveQuota);

  return (
    <div className="budget-overview">
      {isProfileMode ? (
        <GlobalIncomeHub
          title={profile?.name ? t('budget.incomeHub.profileHubTitle').replace('{name}', profile.name) : undefined}
          initialBalance={profile?.initialBalance || 0}
          onUpdateInitialBalance={(v) => onUpdateProfileBalance?.(selectedProfileId, v)}
          monthlyIncome={profile?.monthlyIncome || 0}
          onUpdateMonthlyIncome={(v) => onUpdateProfileIncome?.(selectedProfileId, v)}
          monthlyQuota={effectiveQuota}
        />
      ) : (
        <ConsolidatedProfilesGrid
          profiles={profiles}
          expenses={expenses}
          totalLiquidity={totalLiquidity}
          totalIncome={totalIncome}
          onSelectProfile={onSelectProfile}
          onDepositQuota={handleDepositProfileQuota}
          simulationStrategy={simulationStrategy}
        />
      )}

      <BudgetKpiGrid
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
