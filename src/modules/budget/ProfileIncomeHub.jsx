import React from 'react';
import { Wallet, DollarSign } from 'lucide-react';
import { useI18n } from '../../core/i18n';
import { ProfileDedicatedFinanceBox } from './ProfileDedicatedFinanceBox';
import './IncomeOverviewCard.css';
import './ProfileIncomeHub.css';

export function ProfileIncomeHub({
  profileName = '',
  usesDedicatedFund = false,
  onToggleDedicatedFund,
  profileFund = 0,
  onSaveProfileFund,
  globalFund = 0,
  usesDedicatedIncome = false,
  onToggleDedicatedIncome,
  profileIncome = 0,
  onSaveProfileIncome,
  globalIncome = 0,
}) {
  const { t } = useI18n();

  return (
    <div className="income-hub-card profile-hub-card">
      <div className="income-hub-header">
        <h4 className="income-hub-title">
          {t('budget.incomeHub.profileHubTitle').replace('{name}', profileName)}
        </h4>
      </div>

      <div className="income-inputs-grid">
        <ProfileDedicatedFinanceBox
          icon={<Wallet size={24} className="income-box-icon" />}
          label={t('budget.incomeHub.dedicatedFund')}
          usesDedicated={usesDedicatedFund}
          onToggleDedicated={onToggleDedicatedFund}
          value={profileFund}
          onSave={onSaveProfileFund}
          checkboxLabel={t('budget.incomeHub.useDedicatedFund')}
          sharedNotice={t('budget.incomeHub.sharedFundNotice')}
          fallbackValue={globalFund}
          saveButtonText={t('budget.incomeHub.saveBalance')}
        />

        <ProfileDedicatedFinanceBox
          icon={<DollarSign size={24} className="income-box-icon" />}
          label={t('budget.incomeHub.dedicatedIncome')}
          usesDedicated={usesDedicatedIncome}
          onToggleDedicated={onToggleDedicatedIncome}
          value={profileIncome}
          onSave={onSaveProfileIncome}
          checkboxLabel={t('budget.incomeHub.useDedicatedIncome')}
          sharedNotice={t('budget.incomeHub.sharedIncomeNotice')}
          fallbackValue={globalIncome}
          saveButtonText={t('budget.incomeHub.saveIncome')}
        />
      </div>
    </div>
  );
}
