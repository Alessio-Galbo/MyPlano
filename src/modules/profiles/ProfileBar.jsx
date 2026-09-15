import React from 'react';
import { Users, Plus, Trash2 } from 'lucide-react';
import { useI18n } from '../../core/i18n';
import { Button } from '../../components/ui';
import './ProfileBar.css';

export function ProfileBar({
  profiles,
  selectedProfileId,
  onSelectProfile,
  onOpenAddModal,
  onRequestDeleteProfile,
}) {
  const { t } = useI18n();

  return (
    <div className="profile-bar">
      <div className="profile-pills">
        <button
          type="button"
          className={`profile-pill ${selectedProfileId === 'all' ? 'active' : ''}`}
          onClick={() => onSelectProfile('all')}
        >
          <Users size={16} />
          <span>{t('common.profiles.allProfiles')}</span>
        </button>

        {profiles.map((profile) => {
          const isActive = selectedProfileId === profile.id;
          return (
            <div key={profile.id} className="profile-pill-wrapper">
              <button
                type="button"
                className={`profile-pill ${isActive ? 'active' : ''}`}
                onClick={() => onSelectProfile(profile.id)}
              >
                <span className={`profile-color-dot dot-${profile.id}`} />
                <span>{profile.name}</span>
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
  );
}
