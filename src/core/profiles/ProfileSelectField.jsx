import React from 'react';
import { useI18n } from '../i18n';
import { ensureProfileClass } from '../theme/dynamicThemeService';
import { hasProfile } from './orphanItems';
import { NoProfileNotice } from './NoProfileNotice';
import './profileField.css';

// Required profile menu with the profile colour dot. With no profiles it shows a notice
// with a "Create profile" button instead (the form cannot be saved).
export function ProfileSelectField({ value, onChange, profiles = [], label, id = 'profile-select' }) {
  const { t } = useI18n();
  if (profiles.length === 0) return <NoProfileNotice />;

  const valid = hasProfile(profiles, value);
  const index = profiles.findIndex((p) => String(p.id) === String(value));
  const dotClass = valid ? ensureProfileClass(profiles[index].id, index) : 'profile-dot-missing';

  return (
    <div className="form-group">
      <label className="form-label" htmlFor={id}>{label || t('common.profileField.label')}</label>
      <div className="profile-select-wrap">
        <span className={`dynamic-color-dot profile-select-dot ${dotClass}`} aria-hidden="true" />
        <select
          id={id}
          className="form-input profile-select"
          required
          value={valid ? value : ''}
          onChange={(e) => {
            const p = profiles.find((x) => String(x.id) === e.target.value);
            onChange(p ? p.id : '');
          }}
          data-testid="profile-select"
        >
          {!valid && <option value="" disabled>{t('common.profileField.choose')}</option>}
          {profiles.map((p) => (
            <option key={p.id} value={p.id}>{p.name}</option>
          ))}
        </select>
      </div>
    </div>
  );
}
