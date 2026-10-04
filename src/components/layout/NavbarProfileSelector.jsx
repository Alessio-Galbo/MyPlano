import React from 'react';
import { Layers, ChevronDown } from 'lucide-react';
import { useI18n, formatCurrency } from '../../core/i18n';
import { calculateItemAnnualCost } from '../../modules/budget/budgetCalculations';
import { ensureProfileClass } from '../../core/theme/dynamicThemeService';
import { NavbarNotificationsBtn } from './NavbarNotificationsBtn';
import './NavbarProfileSelector.css';

export function NavbarProfileSelector({
  profiles = [],
  selectedProfileId = 'all',
  expenses = [],
  documents = [],
  onOpenManageModal,
}) {
  const { t } = useI18n();

  const getProfileAnnual = (pId) => {
    const list = pId === 'all' ? expenses : expenses.filter((e) => e.profileId === pId);
    return list.reduce((sum, item) => sum + calculateItemAnnualCost(item), 0);
  };

  const formatCompact = (v) =>
    formatCurrency(v, { maximumFractionDigits: 0 });

  const activeProfile = profiles.find((p) => p.id === selectedProfileId);
  const isMaster = selectedProfileId === 'all';
  const annualTotal = getProfileAnnual(selectedProfileId);
  const activeIndex = profiles.findIndex((p) => p.id === selectedProfileId);
  const themeClass = activeProfile ? ensureProfileClass(activeProfile.id, activeIndex) : '';

  return (
    <div className="navbar-profile-selector">
      <button
        type="button"
        className={`nav-profile-pill ${isMaster ? 'master' : ''}`}
        onClick={onOpenManageModal}
        title={t('common.profiles.manage')}
      >
        {isMaster ? (
          <Layers size={13} className="nav-profile-icon" />
        ) : (
          <span className={`dynamic-color-dot ${themeClass}`} />
        )}
        <span className="nav-profile-name">
          {isMaster ? t('common.profiles.allProfiles') : (activeProfile?.name || '')}
        </span>
        <span className="nav-profile-annual">
          {formatCompact(annualTotal)}{t('common.profiles.perYear')}
        </span>
        <ChevronDown size={12} className="nav-profile-chevron" />
      </button>

      <NavbarNotificationsBtn
        expenses={expenses}
        documents={documents}
        selectedProfileId={selectedProfileId}
        profiles={profiles}
      />
    </div>
  );
}
