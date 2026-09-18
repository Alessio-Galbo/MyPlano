import React from 'react';
import { Globe, HelpCircle } from 'lucide-react';
import { Toggle } from '../../components/ui';
import { useI18n } from '../../core/i18n';
import { useApp } from '../../core/state';
import { SettingsBackupCard } from './SettingsBackupCard';
import { SettingsResetCard } from './SettingsResetCard';
import './SettingsView.css';

export function SettingsView({ documents, expenses, onDataRestored }) {
  const { language, setLanguage, t } = useI18n();
  const { isGlobalMuted, toggleGlobalMute } = useApp();

  return (
    <div className="settings-container">
      <div className="settings-card">
        <div className="settings-card-header">
          <Globe size={20} className="text-muted" />
          <h3 className="settings-card-title">{t('common.nav.settings')}</h3>
        </div>

        <div className="settings-row">
          <div className="settings-row-info">
            <span className="settings-row-label">{t('common.settings.languageLabel')}</span>
            <span className="settings-row-desc">{t('common.settings.languageDesc')}</span>
          </div>
          <select
            className="form-input"
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
          >
            <option value="it">Italiano (IT)</option>
            <option value="en">English (EN)</option>
          </select>
        </div>

        <div className="settings-row">
          <div className="settings-row-info">
            <span className="settings-row-label">{t('common.notifications.globalMute')}</span>
            <span className="settings-row-desc">{t('common.settings.muteDesc')}</span>
          </div>
          <Toggle checked={isGlobalMuted} onChange={toggleGlobalMute} />
        </div>
      </div>

      <div className="settings-card">
        <div className="settings-card-header">
          <HelpCircle size={20} className="text-muted" />
          <h3 className="settings-card-title">{t('budget.advice.title')}</h3>
        </div>
        <p className="settings-guide-text">{t('budget.advice.text')}</p>
      </div>

      <SettingsBackupCard
        documents={documents}
        expenses={expenses}
        onDataRestored={onDataRestored}
      />

      <SettingsResetCard onDataRestored={onDataRestored} />
    </div>
  );
}
