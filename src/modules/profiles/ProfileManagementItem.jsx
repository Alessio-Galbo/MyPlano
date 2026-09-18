import React from 'react';
import { Trash2, Check } from 'lucide-react';
import { useI18n } from '../../core/i18n';
import { ensureProfileClass } from '../../core/theme/dynamicThemeService';

export function ProfileManagementItem({
  profile,
  colorIndex = 0,
  isActive,
  annualTotal,
  onSelect,
  canDelete,
  onDelete,
  formatCompact,
}) {
  const { t } = useI18n();
  const themeClass = ensureProfileClass(profile?.id, colorIndex);

  return (
    <div className={`profile-mgmt-item dynamic-profile-item ${themeClass} ${isActive ? 'active' : ''}`}>
      <button type="button" className="profile-mgmt-item-btn" onClick={onSelect}>
        <div className="profile-mgmt-info">
          <span className={`dynamic-color-dot ${themeClass}`} />
          <div>
            <div className="profile-mgmt-name-row">
              <span className="profile-mgmt-name">{profile?.name}</span>
              {isActive && (
                <span className="profile-active-tag">
                  <Check size={12} /> {t('common.profiles.active')}
                </span>
              )}
            </div>
            <span className="profile-mgmt-balance">
              {t('common.profiles.fund')}: {formatCompact(profile?.initialBalance)}
            </span>
          </div>
        </div>
        <div className="profile-mgmt-amounts">
          <span className="profile-mgmt-annual">
            {formatCompact(annualTotal)}{t('common.profiles.perYear')}
          </span>
        </div>
      </button>
      {canDelete && (
        <button
          type="button"
          className="profile-mgmt-delete-btn"
          title={t('common.profiles.deleteProfile')}
          onClick={onDelete}
        >
          <Trash2 size={15} />
        </button>
      )}
    </div>
  );
}
