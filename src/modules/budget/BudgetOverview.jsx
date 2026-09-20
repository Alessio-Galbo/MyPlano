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
  documents = [],
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
    documents,
    selectedProfileId,
    simulationStrategy,
    coldStart,
  });

  const { profile, isProfileMode, metrics, upcomingItems, totalLiquidity, totalIncome, effectiveQuota, currentIncome, margin } = state;

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
          onDepositQuota={(pId, a) => performDepositProfileQuota(profiles, pId, a, onDepositProfileQuota, onUpdateProfileBalance)}
          simulationStrategy={simulationStrategy}
        />
      )}

      <BudgetKpiGrid
        showDiscretionary={!isProfileMode}
        discretionaryMargin={margin}
        monthlyIncome={currentIncome}
        expenses={expenses}
        documents={documents}
        selectedProfileId={selectedProfileId}
        profiles={profiles}
      />

      <ColdStartCard
        analysis={coldStart}
        standardMonthlyQuota={metrics.monthlyQuota}
        selectedStrategy={simulationStrategy}
        onSelectStrategy={onSelectStrategy}
        onTopUpFund={(a) => {
          const tid = isProfileMode ? selectedProfileId : profiles[0]?.id;
          if (tid) performTopUpFund(profiles, tid, a, onUpdateProfileBalance, onSelectStrategy);
        }}
      />
    </div>
  );
}
