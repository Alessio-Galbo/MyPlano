import React from 'react';
import { calculateBudgetMetrics } from './budgetCalculations';
import { BudgetKpiGrid } from './BudgetKpiGrid';
import { ColdStartCard } from './ColdStartCard';
import { GlobalIncomeHub } from './GlobalIncomeHub';
import { ProfileIncomeHub } from './ProfileIncomeHub';
import './BudgetOverview.css';

export function BudgetOverview({
  expenses,
  profiles = [],
  selectedProfileId = 'all',
  initialBalance = 0,
  onUpdateInitialBalance,
  monthlyIncome = 0,
  onUpdateMonthlyIncome,
  profileFunds = {},
  profileFundConfigs = {},
  onUpdateProfileFund,
  onSetProfileUsesDedicatedFund,
  profileIncomes = {},
  profileIncomeConfigs = {},
  onUpdateProfileIncome,
  onSetProfileUsesDedicatedIncome,
  effectiveFund = 0,
  coldStart,
  simulationStrategy = 'survival',
  onSelectStrategy,
}) {
  const profile = profiles.find((p) => p.id === selectedProfileId);
  const isProfileMode = selectedProfileId !== 'all';
  const metrics = calculateBudgetMetrics(expenses, selectedProfileId);

  const handleTopUpFund = (amount) => {
    if (isProfileMode && profileFundConfigs[selectedProfileId]) {
      const current = profileFunds[selectedProfileId] || 0;
      onUpdateProfileFund(selectedProfileId, Math.round((current + amount) * 100) / 100);
    } else {
      onUpdateInitialBalance(Math.round((initialBalance + amount) * 100) / 100);
    }
  };

  return (
    <div className="budget-overview">
      <GlobalIncomeHub
        initialBalance={initialBalance}
        onUpdateInitialBalance={onUpdateInitialBalance}
        monthlyIncome={monthlyIncome}
        onUpdateMonthlyIncome={onUpdateMonthlyIncome}
        safeMonthlyQuota={metrics.monthlyQuota}
      />

      {isProfileMode && (
        <ProfileIncomeHub
          profileName={profile?.name || ''}
          usesDedicatedFund={!!profileFundConfigs[selectedProfileId]}
          onToggleDedicatedFund={(v) => onSetProfileUsesDedicatedFund(selectedProfileId, v)}
          profileFund={profileFunds[selectedProfileId] || 0}
          onSaveProfileFund={(v) => onUpdateProfileFund(selectedProfileId, v)}
          globalFund={initialBalance}
          usesDedicatedIncome={!!profileIncomeConfigs[selectedProfileId]}
          onToggleDedicatedIncome={(v) => onSetProfileUsesDedicatedIncome(selectedProfileId, v)}
          profileIncome={profileIncomes[selectedProfileId] || 0}
          onSaveProfileIncome={(v) => onUpdateProfileIncome(selectedProfileId, v)}
          globalIncome={monthlyIncome}
        />
      )}

      <BudgetKpiGrid metrics={metrics} />

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
