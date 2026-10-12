// Settings card for automatic periodic backups and local snapshot recovery.
import React from 'react';
import { History } from 'lucide-react';
import { Toggle } from '../../components/ui';
import { useI18n } from '../../core/i18n';
import { useAutoBackupActions } from './useAutoBackupActions';
import { AutoBackupConfigSection } from './AutoBackupConfigSection';
import { AutoBackupSnapshotsList } from './AutoBackupSnapshotsList';
import { AutoBackupConfirmModal } from './AutoBackupConfirmModal';
import { backupMessageText } from './backupTexts';
import './SettingsAutoBackupCard.css';

export function SettingsAutoBackupCard({ onDataRestored }) {
  const { t } = useI18n();
  const b = useAutoBackupActions(onDataRestored);
  const pendingMeta = b.pendingRestore ? b.snapshotMeta(b.pendingRestore) : null;

  return (
    <div className="settings-card" data-testid="auto-backup-card">
      <div className="settings-card-header">
        <History size={20} className="text-muted" />
        <h3 className="settings-card-title">{t('common.autoBackup.title')}</h3>
      </div>

      <div className="settings-row">
        <div className="settings-row-info">
          <span className="settings-row-label">{t('common.autoBackup.enableLabel')}</span>
          <span className="settings-row-desc">{t('common.autoBackup.desc')}</span>
        </div>
        <Toggle checked={b.prefs.enabled} onChange={b.toggleEnabled} id="auto-backup-toggle" />
      </div>

      {b.prefs.enabled && (
        <>
          <AutoBackupConfigSection
            prefs={b.prefs}
            busy={b.busy}
            onChangeFrequency={b.changeFrequency}
            onCreateSnapshotNow={b.createSnapshotNow}
          />
          <AutoBackupSnapshotsList
            snapshots={b.snapshots}
            snapshotMeta={b.snapshotMeta}
            onRestore={b.setPendingRestore}
            onDownload={b.downloadSnapshot}
            onDelete={b.removeSnapshot}
            disabled={b.busy}
          />
        </>
      )}

      {b.message && (
        <div className={`backup-message ${b.message.kind}`} role="status">
          {backupMessageText(t, b.message.code)}
        </div>
      )}

      <AutoBackupConfirmModal
        pendingRestore={b.pendingRestore}
        meta={pendingMeta}
        onClose={() => b.setPendingRestore(null)}
        onConfirm={b.confirmRestore}
      />
    </div>
  );
}
