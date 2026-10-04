import React from 'react';
import { Coffee, Heart } from 'lucide-react';
import { useI18n } from '../../core/i18n';
import './SettingsSupportCard.css';

const KOFI_URL = 'https://ko-fi.com/devangel';

// Optional donation link: MyPlano is free, local-first and has no ads or tracking.
export function SettingsSupportCard() {
  const { t } = useI18n();

  return (
    <div className="settings-card support-card">
      <div className="settings-card-header">
        <Heart size={20} className="support-card-icon" />
        <h3 className="settings-card-title">{t('common.support.title')}</h3>
      </div>
      <p className="settings-guide-text">{t('common.support.desc')}</p>
      <a
        className="btn btn-primary support-card-button"
        href={KOFI_URL}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={t('common.support.buttonAria')}
      >
        <Coffee size={16} aria-hidden="true" />
        <span>{t('common.support.button')}</span>
      </a>
    </div>
  );
}
