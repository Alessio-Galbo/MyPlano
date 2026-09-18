import React from 'react';
import { Layers, Plus, Trash2 } from 'lucide-react';
import { useI18n } from '../../core/i18n';
import { Button } from '../../components/ui';
import { ensureProfileClass } from '../../core/theme/dynamicThemeService';
import './ProfileBar.css';

export function ProfileBar({
  profiles,
  selectedProfileId,
  onSelectProfile,
  onOpenAddModal,
  onRequestDeleteProfile,
}) {
  const { t } = useI18n();

  const formatCompact = (v) =>
    Number(v || 0).toLocaleString('it-IT', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 });

  const totalLiquidity = profiles.reduce((s, p) => s + (Number(p.initialBalance) || 0), 0);

  return (
    <div className="profile-bar">
      <div className="profile-left-group">
        <div className="profile-pills">
          {profiles.map((profile, idx) => {
            const isActive = selectedProfileId === profile.id;
            const themeClass = ensureProfileClass(profile.id, idx);
            return (
              <div key={profile.id} className="profile-pill-wrapper">
                <button
                  type="button"
                  className={`profile-pill ${isActive ? 'active' : ''}`}
                  onClick={() => onSelectProfile(profile.id)}
                >
                  <span className={`dynamic-color-dot ${themeClass}`} />
                  <span>{profile.name}</span>
                  <span className="profile-pill-balance">{formatCompact(profile.initialBalance)}</span>
                </button>
                {isActive && profiles.length > 1 && onRequestDeleteProfile && (
                  <button
                    type="button"
                    className="profile-pill-delete"
                    title={t('common.profiles.deleteProfile')}
                    onClick={() => onRequestDeleteProfile(profile)}
                  >
                    <Trash2 size={12} />
                  </button>
                )}
              </div>
            );
          })}
        </div>

        <Button
          variant="secondary"
          size="sm"
          icon={<Plus size={14} />}
          onClick={onOpenAddModal}
        >
          {t('common.profiles.addProfile')}
        </Button>
      </div>

      {profiles.length > 1 && (
        <div className="profile-master-section">
          <button
            type="button"
            className={`profile-pill profile-pill-master ${selectedProfileId === 'all' ? 'active' : ''}`}
            onClick={() => onSelectProfile('all')}
            title={t('budget.overview.title')}
          >
            <Layers size={14} />
            <span>{t('common.profiles.allProfiles')}</span>
            <span className="profile-pill-balance">{formatCompact(totalLiquidity)}</span>
          </button>
        </div>
      )}
    </div>
  );
}
