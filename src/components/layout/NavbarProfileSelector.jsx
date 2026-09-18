import React from 'react';
import { Layers, ChevronDown, Plus } from 'lucide-react';
import { useI18n } from '../../core/i18n';
import { calculateItemAnnualCost } from '../../modules/budget/budgetCalculations';
import { ensureProfileClass } from '../../core/theme/dynamicThemeService';
import './NavbarProfileSelector.css';

export function NavbarProfileSelector({
  profiles = [],
  selectedProfileId = 'all',
  expenses = [],
  onOpenManageModal,
  onOpenAddModal,
}) {
  const { t } = useI18n();

  const getProfileAnnual = (pId) => {
    const list = pId === 'all' ? expenses : expenses.filter((e) => e.profileId === pId);
    return list.reduce((sum, item) => sum + calculateItemAnnualCost(item), 0);
  };

  const formatCompact = (v) =>
    Number(v || 0).toLocaleString('it-IT', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 });

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

      <button
        type="button"
        className="nav-profile-add-btn"
        onClick={onOpenAddModal}
        title={t('common.profiles.addProfile')}
      >
        <Plus size={14} />
      </button>
    </div>
  );
}
