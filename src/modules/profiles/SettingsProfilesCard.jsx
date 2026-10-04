import React from 'react';
import { Users, Plus, Settings2 } from 'lucide-react';
import { Button } from '../../components/ui';
import { useI18n } from '../../core/i18n';
import { ensureProfileClass } from '../../core/theme/dynamicThemeService';
import { requestAddProfile, requestManageProfiles } from '../../core/state/profileActions';
import './SettingsProfilesCard.css';

// Settings > Profiles: list with colours, shortcuts to the management dialog and to "New profile".
export function SettingsProfilesCard({ profiles = [] }) {
  const { t } = useI18n();

  return (
    <div className="settings-card settings-profiles-card">
      <div className="settings-card-header">
        <Users size={20} className="text-muted" />
        <h3 className="settings-card-title">{t('common.profiles.settingsTitle')}</h3>
      </div>
      <p className="settings-row-desc">{t('common.profiles.settingsDesc')}</p>

      {profiles.length > 0 ? (
        <ul className="settings-profiles-list">
          {profiles.map((p, idx) => {
            const themeClass = ensureProfileClass(p.id, idx);
            return (
              <li key={p.id} className={`settings-profiles-chip ${themeClass}`}>
                <span className={`dynamic-color-dot ${themeClass}`} />
                <span className="settings-profiles-name">{p.name}</span>
              </li>
            );
          })}
        </ul>
      ) : (
        <p className="settings-row-desc">{t('common.profiles.settingsEmpty')}</p>
      )}

      <div className="settings-profiles-actions">
        {profiles.length > 0 && (
          <Button variant="secondary" icon={<Settings2 size={16} />} onClick={requestManageProfiles}>
            {t('common.profiles.manageButton')}
          </Button>
        )}
        <Button variant="primary" icon={<Plus size={16} />} onClick={requestAddProfile}>
          {t('common.profiles.addProfile')}
        </Button>
      </div>
    </div>
  );
}
