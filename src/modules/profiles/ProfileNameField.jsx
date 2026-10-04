import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { useI18n } from '../../core/i18n';

// Name input with a non-blocking warning for duplicate names.
export function ProfileNameField({ value, onChange, isDuplicate }) {
  const { t } = useI18n();
  return (
    <div className="form-group">
      <label htmlFor="profile-name-input" className="form-label">
        {t('common.profiles.profileName')}
      </label>
      <input
        id="profile-name-input"
        type="text"
        className="form-input"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={t('common.profiles.profileName')}
        aria-describedby={isDuplicate ? 'profile-name-warning' : undefined}
        autoFocus
        required
      />
      {isDuplicate && (
        <p id="profile-name-warning" className="profile-name-warning" role="status">
          <AlertTriangle size={14} /> {t('common.profiles.duplicateName')}
        </p>
      )}
    </div>
  );
}
