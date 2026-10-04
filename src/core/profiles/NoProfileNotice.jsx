import React from 'react';
import { UserPlus } from 'lucide-react';
import { Button } from '../../components/ui';
import { useI18n } from '../i18n';
import { requestAddProfile } from '../state/profileActions';
import './profileField.css';

// Shown where a profile must be chosen but none exists yet.
export function NoProfileNotice({ text }) {
  const { t } = useI18n();
  return (
    <div className="no-profile-notice" role="alert" data-testid="no-profile-notice">
      <span className="no-profile-text">{text || t('common.profileField.noProfiles')}</span>
      <Button variant="primary" size="sm" icon={<UserPlus size={14} />} onClick={requestAddProfile}>
        {t('common.profileField.createProfile')}
      </Button>
    </div>
  );
}
