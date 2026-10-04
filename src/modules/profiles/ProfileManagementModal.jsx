import React from 'react';
import { Layers, Plus, Check } from 'lucide-react';
import { useI18n, formatCurrency } from '../../core/i18n';
import { Modal, Button } from '../../components/ui';
import { calculateItemAnnualCost } from '../budget/budgetCalculations';
import { ProfileManagementItem } from './ProfileManagementItem';
import './ProfileManagementModal.css';

export function ProfileManagementModal({
  isOpen,
  onClose,
  profiles = [],
  selectedProfileId = 'all',
  expenses = [],
  onSelectProfile,
  onOpenAddModal,
  onRequestDeleteProfile,
  onRequestEditProfile,
}) {
  const { t } = useI18n();

  const getProfileAnnual = (pId) => {
    const list = pId === 'all' ? expenses : expenses.filter((e) => e.profileId === pId);
    return list.reduce((sum, item) => sum + calculateItemAnnualCost(item), 0);
  };

  const formatCompact = (v) =>
    formatCurrency(v, { maximumFractionDigits: 0 });

  const totalLiquidity = profiles.reduce((s, p) => s + (Number(p.initialBalance) || 0), 0);
  const totalAnnual = getProfileAnnual('all');

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={t('common.profiles.modalTitle')}>
      <div className="profile-mgmt-container">
        <p className="profile-mgmt-subtitle">{t('common.profiles.modalSubtitle')}</p>

        <div className="profile-mgmt-list">
          {profiles.length > 1 && (
            <button
              type="button"
              className={`profile-mgmt-item master ${selectedProfileId === 'all' ? 'active' : ''}`}
              onClick={() => { onSelectProfile('all'); onClose(); }}
            >
              <div className="profile-mgmt-info">
                <Layers size={18} className="profile-mgmt-master-icon" />
                <div>
                  <div className="profile-mgmt-name-row">
                    <span className="profile-mgmt-name">{t('common.profiles.allProfiles')}</span>
                    {selectedProfileId === 'all' && (
                      <span className="profile-active-tag"><Check size={12} /> {t('common.profiles.active')}</span>
                    )}
                  </div>
                  <span className="profile-mgmt-desc">{t('common.profiles.viewAllDesc')}</span>
                </div>
              </div>
              <div className="profile-mgmt-amounts">
                <span className="profile-mgmt-annual">{formatCompact(totalAnnual)}{t('common.profiles.perYear')}</span>
                <span className="profile-mgmt-balance">{t('common.profiles.fund')}: {formatCompact(totalLiquidity)}</span>
              </div>
            </button>
          )}

          {profiles.map((p, idx) => (
            <ProfileManagementItem
              key={p.id}
              profile={p}
              colorIndex={idx}
              isActive={selectedProfileId === p.id}
              annualTotal={getProfileAnnual(p.id)}
              onSelect={() => { onSelectProfile(p.id); onClose(); }}
              canDelete={profiles.length > 1}
              onDelete={() => { onClose(); onRequestDeleteProfile(p); }}
              onEdit={() => { onClose(); onRequestEditProfile(p); }}
              formatCompact={formatCompact}
            />
          ))}
        </div>

        <div className="profile-mgmt-footer">
          <Button variant="secondary" icon={<Plus size={16} />} onClick={() => { onClose(); onOpenAddModal(); }}>
            {t('common.profiles.addProfile')}
          </Button>
          <Button variant="ghost" onClick={onClose}>{t('common.actions.close')}</Button>
        </div>
      </div>
    </Modal>
  );
}
