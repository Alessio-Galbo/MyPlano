import React, { useState, useEffect } from 'react';
import { storageService } from '../../core/storage/storageService';
import { BudgetOverview } from './BudgetOverview';
import { CashflowTimeline } from './CashflowTimeline';
import { calculateColdStartAnalysis } from './budgetCalculations';

export function BudgetTab({
  expenses,
  documents = [],
  profiles = [],
  selectedProfileId = 'all',
  onSelectProfile,
  onUpdateProfileBalance,
  onUpdateProfileIncome,
  onDepositProfileQuota,
}) {
  const [strategies, setStrategies] = useState(() => storageService.getProfileStrategies());

  const profile = profiles.find((p) => p.id === selectedProfileId);
  const totalLiquidity = profiles.reduce((s, p) => s + (Number(p.initialBalance) || 0), 0);
  const effectiveFund = selectedProfileId === 'all' ? totalLiquidity : (profile?.initialBalance || 0);

  const coldStart = calculateColdStartAnalysis(expenses, selectedProfileId, effectiveFund);

  const currentStrategy = strategies[selectedProfileId] || 'standard';
  const simulationStrategy = (!coldStart.hasDeficit && currentStrategy === 'survival')
    ? 'standard'
    : currentStrategy;

  const handleSelectStrategy = (strat) => {
    setStrategies((prev) => ({ ...prev, [selectedProfileId]: strat }));
    storageService.saveProfileStrategy(selectedProfileId, strat);
  };

  useEffect(() => {
    if (!coldStart.hasDeficit && currentStrategy === 'survival') {
      handleSelectStrategy('standard');
    }
  }, [coldStart.hasDeficit, currentStrategy]);

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
        documents={documents}
        profiles={profiles}
        selectedProfileId={selectedProfileId}
        onSelectProfile={onSelectProfile}
        onUpdateProfileBalance={onUpdateProfileBalance}
        onUpdateProfileIncome={onUpdateProfileIncome}
        onDepositProfileQuota={onDepositProfileQuota}
        coldStart={coldStart}
        simulationStrategy={simulationStrategy}
        onSelectStrategy={handleSelectStrategy}
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
