import React, { useRef } from 'react';
import { Database, Download, Upload, Calendar } from 'lucide-react';
import { Button } from '../../components/ui';
import { useI18n } from '../../core/i18n';
import { storageService } from '../../core/storage';
import { generateIcsCalendar, downloadFile } from './icsExportHelper';

export function SettingsBackupCard({ documents, expenses, onDataRestored }) {
  const { t } = useI18n();
  const fileInputRef = useRef(null);

  const handleExportIcs = () => {
    const ics = generateIcsCalendar(documents, expenses);
    downloadFile(ics, 'myplano-calendario.ics', 'text/calendar;charset=utf-8');
  };

  const handleExportBackup = () => {
    const json = storageService.exportAllData();
    const dateStr = new Date().toISOString().split('T')[0];
    downloadFile(json, `myplano-backup-${dateStr}.json`, 'application/json');
  };

  const handleImportBackup = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const res = storageService.importAllData(event.target.result);
      if (res.success && onDataRestored) onDataRestored();
    };
    reader.readAsText(file);
  };

  return (
    <div className="settings-card">
      <div className="settings-card-header">
        <Database size={20} className="text-muted" />
        <h3 className="settings-card-title">
          {t('common.actions.backup')} & {t('common.actions.exportCalendar')}
        </h3>
      </div>

      <div className="settings-row">
        <div className="settings-row-info">
          <span className="settings-row-label">{t('common.actions.exportCalendar')}</span>
          <span className="settings-row-desc">{t('common.settings.calendarDesc')}</span>
        </div>
        <Button variant="secondary" size="sm" icon={<Calendar size={15} />} onClick={handleExportIcs}>
          {t('common.actions.exportCalendar')}
        </Button>
      </div>

      <div className="settings-row">
        <div className="settings-row-info">
          <span className="settings-row-label">{t('common.actions.backup')}</span>
          <span className="settings-row-desc">{t('common.settings.backupDesc')}</span>
        </div>
        <div className="doc-actions">
          <Button variant="secondary" size="sm" icon={<Download size={15} />} onClick={handleExportBackup}>
            {t('common.actions.backup')}
          </Button>
          <Button variant="secondary" size="sm" icon={<Upload size={15} />} onClick={() => fileInputRef.current?.click()}>
            {t('common.actions.restore')}
          </Button>
          <input type="file" ref={fileInputRef} onChange={handleImportBackup} accept=".json" className="hidden-file-input" />
        </div>
      </div>
    </div>
  );
}
