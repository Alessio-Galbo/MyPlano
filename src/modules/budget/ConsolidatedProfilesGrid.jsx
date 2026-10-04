import React, { useState, useMemo } from 'react';
import { useI18n } from '../../core/i18n';
import { storageService } from '../../core/storage/storageService';
import { calculateBudgetMetrics, calculateColdStartAnalysis } from './budgetCalculations';
import { ConsolidatedProfileCard } from './ConsolidatedProfileCard';
import { ConsolidatedTotalCard } from './ConsolidatedTotalCard';
import { DepositAllConfirmModal } from './DepositAllConfirmModal';
import './ConsolidatedProfilesGrid.css';

export function ConsolidatedProfilesGrid({
  profiles = [],
  expenses = [],
  totalLiquidity = 0,
  totalIncome = 0,
  onSelectProfile,
  onDepositQuota,
  simulationStrategy = 'standard',
}) {
  const { t } = useI18n();
  const [isDepositAllOpen, setIsDepositAllOpen] = useState(false);
  const [justDepositedAll, setJustDepositedAll] = useState(false);

  const profilesWithQuota = useMemo(() => {
    return profiles.map((p) => {
      const metrics = calculateBudgetMetrics(expenses, p.id);
      const analysis = calculateColdStartAnalysis(expenses, p.id, p.initialBalance);
      const strat = storageService.getProfileStrategy(p.id);
      const isPianoB = strat === 'survival' && analysis.hasDeficit;
      const quota = isPianoB ? analysis.catchUpMonthlyQuota : metrics.monthlyQuota;
      return { ...p, effectiveQuota: quota };
    });
  }, [profiles, expenses]);

  const totalMonthlyQuota = profilesWithQuota.reduce((sum, p) => sum + (p.effectiveQuota || 0), 0);

  const handleConfirmDepositAll = () => {
    profilesWithQuota.forEach((p) => {
      if (p.effectiveQuota > 0 && onDepositQuota) {
        onDepositQuota(p.id, p.effectiveQuota);
      }
    });
    setIsDepositAllOpen(false);
    setJustDepositedAll(true);
    setTimeout(() => setJustDepositedAll(false), 2500);
  };

  const showTotalCard = profiles.length >= 2;
  if (profiles.length === 0) return null; // the first-profile guide is shown instead

  return (
    <div className="consolidated-profiles-section">
      <div className="consolidated-section-header">
        <h4 className="consolidated-section-title">{t('budget.overview.profilesHealthTitle')}</h4>
      </div>

      <div className="consolidated-profiles-grid">
        {showTotalCard && (
          <ConsolidatedTotalCard
            profiles={profiles}
            expenses={expenses}
            totalLiquidity={totalLiquidity}
            totalIncome={totalIncome}
            totalMonthlyQuota={totalMonthlyQuota}
            onOpenDepositAllModal={() => setIsDepositAllOpen(true)}
            justDeposited={justDepositedAll}
          />
        )}

        {profiles.map((p, idx) => (
          <ConsolidatedProfileCard
            key={p.id}
            profile={p}
            colorIndex={idx}
            expenses={expenses}
            onSelectProfile={onSelectProfile}
            onDepositQuota={onDepositQuota}
            simulationStrategy={simulationStrategy}
          />
        ))}
      </div>

      <DepositAllConfirmModal
        isOpen={isDepositAllOpen}
        onClose={() => setIsDepositAllOpen(false)}
        onConfirm={handleConfirmDepositAll}
        profilesWithQuota={profilesWithQuota}
        totalMonthlyQuota={totalMonthlyQuota}
      />
    </div>
  );
}
