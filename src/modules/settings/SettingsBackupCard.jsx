import React, { useRef } from 'react';
import { Database, Download, Upload, Calendar } from 'lucide-react';
import { Button, Toggle, ConfirmModal } from '../../components/ui';
import { useI18n } from '../../core/i18n';
import { generateIcsCalendar, downloadFile } from './icsExportHelper';
import { useBackupActions } from './useBackupActions';
import { backupMessageText, lastBackupText, importSummaryText, attachmentsSizeText } from './backupTexts';
import './SettingsBackupCard.css';

export function SettingsBackupCard({ documents, expenses, onDataRestored }) {
  const { t, language } = useI18n();
  const fileInputRef = useRef(null);
  const b = useBackupActions(onDataRestored);
  const last = lastBackupText(t, b.lastBackupAt);
  const nOrphans = b.pending?.orphans || 0; // items whose profile is not in the backup
  const orphanText = nOrphans ? ` ${t(nOrphans === 1 ? 'common.backup.orphansOne' : 'common.backup.orphans', { n: nOrphans })}` : '';

  const handleExportIcs = () => {
    const ics = generateIcsCalendar(documents, expenses);
    downloadFile(ics, 'myplano-calendario.ics', 'text/calendar;charset=utf-8');
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

      <div className="settings-row backup-row">
        <div className="settings-row-info">
          <span className="settings-row-label">{t('common.actions.backup')}</span>
          <span className="settings-row-desc">{t('common.settings.backupDesc')}</span>
          <span className={`settings-row-desc backup-last ${last.stale ? 'stale' : ''}`} data-testid="backup-last">
            {last.text}{last.stale ? ` — ${t('common.backup.reminder')}` : ''}
          </span>
        </div>
        <div className="doc-actions">
          <Button variant="secondary" size="sm" icon={<Download size={15} />} onClick={b.exportBackup} disabled={b.busy}>
            {t('common.actions.backup')}
          </Button>
          <Button variant="secondary" size="sm" icon={<Upload size={15} />} onClick={() => fileInputRef.current?.click()} disabled={b.busy}>
            {t('common.actions.restore')}
          </Button>
          <input type="file" ref={fileInputRef} onChange={b.chooseFile} accept=".json,application/json" className="hidden-file-input" data-testid="backup-file-input" />
        </div>
      </div>

      <div className="settings-row">
        <div className="settings-row-info">
          <span className="settings-row-label">{t('common.backup.includeAttachments')}</span>
          {b.includeAttachments && (
            <span className="settings-row-desc">{attachmentsSizeText(t, b.attachmentsSize)}</span>
          )}
        </div>
        <Toggle checked={b.includeAttachments} onChange={b.setIncludeAttachments} id="backup-include-attachments" />
      </div>

      {b.message && (
        <div className={`backup-message ${b.message.kind}`} role={b.message.kind === 'error' ? 'alert' : 'status'} data-testid="backup-message">
          {backupMessageText(t, b.message.code)}
          {b.hasRecovery && (
            <Button variant="danger" size="sm" icon={<Download size={14} />} onClick={b.downloadRecovery}>
              {t('common.backup.downloadRecovery')}
            </Button>
          )}
        </div>
      )}

      <ConfirmModal
        isOpen={Boolean(b.pending)}
        onClose={b.cancelImport}
        onConfirm={b.confirmImport}
        title={t('common.backup.confirmTitle')}
        message={b.pending ? importSummaryText(t, b.pending.meta, language) + orphanText : ''}
        confirmText={t('common.backup.confirmButton')}
        variant="primary"
      />
    </div>
  );
}
