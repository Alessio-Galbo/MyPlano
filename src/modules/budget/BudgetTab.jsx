import React, { useState } from 'react';
import { BudgetOverview } from './BudgetOverview';
import { CashflowTimeline } from './CashflowTimeline';
import { calculateColdStartAnalysis } from './budgetCalculations';

export function BudgetTab({
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
}) {
  const [simulationStrategy, setSimulationStrategy] = useState('survival');

  const usesDedicatedFund = selectedProfileId !== 'all' && !!profileFundConfigs[selectedProfileId];
  const effectiveFund = usesDedicatedFund ? (profileFunds[selectedProfileId] || 0) : initialBalance;

  const usesDedicatedIncome = selectedProfileId !== 'all' && !!profileIncomeConfigs[selectedProfileId];
  const effectiveIncome = usesDedicatedIncome ? (profileIncomes[selectedProfileId] || 0) : monthlyIncome;

  const coldStart = calculateColdStartAnalysis(expenses, selectedProfileId, effectiveFund);

  const simOptions = {
    strategy: simulationStrategy,
    survivalQuota: coldStart.catchUpMonthlyQuota,
    survivalMonthsCount: coldStart.survivalMonthsCount,
    survivalSchedule: coldStart.survivalSchedule,
    bufferRequired: coldStart.initialBufferRequired,
  };

  return (
    <div className="budget-tab-container">
      <BudgetOverview
        expenses={expenses}
        profiles={profiles}
        selectedProfileId={selectedProfileId}
        initialBalance={initialBalance}
        onUpdateInitialBalance={onUpdateInitialBalance}
        monthlyIncome={monthlyIncome}
        onUpdateMonthlyIncome={onUpdateMonthlyIncome}
        profileFunds={profileFunds}
        profileFundConfigs={profileFundConfigs}
        onUpdateProfileFund={onUpdateProfileFund}
        onSetProfileUsesDedicatedFund={onSetProfileUsesDedicatedFund}
        profileIncomes={profileIncomes}
        profileIncomeConfigs={profileIncomeConfigs}
        onUpdateProfileIncome={onUpdateProfileIncome}
        onSetProfileUsesDedicatedIncome={onSetProfileUsesDedicatedIncome}
        effectiveFund={effectiveFund}
        effectiveIncome={effectiveIncome}
        coldStart={coldStart}
        simulationStrategy={simulationStrategy}
        onSelectStrategy={setSimulationStrategy}
      />
      <CashflowTimeline
        expenses={expenses}
        selectedProfileId={selectedProfileId}
        initialBalance={effectiveFund}
        simOptions={simOptions}
      />
    </div>
  );
}
