import React from 'react';
import { StartingBalanceBox } from './StartingBalanceBox';
import { MonthlyIncomeBox } from './MonthlyIncomeBox';
import { DiscretionaryMarginPanel } from './DiscretionaryMarginPanel';
import './IncomeOverviewCard.css';

export function IncomeOverviewCard({
  selectedProfileId = 'all',
  profileName,
  usesDedicatedFund = false,
  onToggleDedicated,
  fundAmount = 0,
  onSaveFund,
  monthlyIncome,
  onSaveMonthlyIncome,
  safeMonthlyQuota,
}) {
  return (
    <div className="income-hub-card">
      <div className="income-inputs-grid">
        <StartingBalanceBox
          selectedProfileId={selectedProfileId}
          profileName={profileName}
          usesDedicatedFund={usesDedicatedFund}
          onToggleDedicated={onToggleDedicated}
          fundAmount={fundAmount}
          onSaveFund={onSaveFund}
        />
        <MonthlyIncomeBox
          monthlyIncome={monthlyIncome}
          onSaveMonthlyIncome={onSaveMonthlyIncome}
        />
      </div>

      <DiscretionaryMarginPanel
        monthlyIncome={monthlyIncome}
        safeMonthlyQuota={safeMonthlyQuota}
      />
    </div>
  );
}
