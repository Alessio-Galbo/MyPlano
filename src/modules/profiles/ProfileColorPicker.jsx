import React from 'react';
import { Check } from 'lucide-react';
import { useI18n } from '../../core/i18n';
import { PROFILE_HUES } from './profileColors';
import './ProfileColorPicker.css';

// Colour choice for a profile: "automatic" (generated colour) or one of PROFILE_HUES.
export function ProfileColorPicker({ value = null, onChange }) {
  const { t } = useI18n();
  const isAuto = !Number.isFinite(value);

  return (
    <div className="form-group">
      <span className="form-label" id="profile-color-label">{t('common.profiles.color')}</span>
      <div className="profile-color-picker" role="radiogroup" aria-labelledby="profile-color-label">
        <button
          type="button"
          role="radio"
          aria-checked={isAuto}
          className={`profile-swatch profile-swatch-auto ${isAuto ? 'selected' : ''}`}
          title={t('common.profiles.colorAuto')}
          aria-label={t('common.profiles.colorAuto')}
          onClick={() => onChange(null)}
        >
          {isAuto ? <Check size={14} /> : t('common.profiles.colorAutoShort')}
        </button>
        {PROFILE_HUES.map((hue, i) => (
          <button
            key={hue}
            type="button"
            role="radio"
            aria-checked={value === hue}
            className={`profile-swatch profile-swatch-hue-${hue} ${value === hue ? 'selected' : ''}`}
            title={t('common.profiles.colorOption', { n: i + 1 })}
            aria-label={t('common.profiles.colorOption', { n: i + 1 })}
            onClick={() => onChange(hue)}
          >
            {value === hue && <Check size={14} />}
          </button>
        ))}
      </div>
    </div>
  );
}
