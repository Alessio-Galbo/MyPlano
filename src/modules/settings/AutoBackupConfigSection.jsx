// Section with frequency selector and manual snapshot creation trigger.
import React from 'react';
import { Plus } from 'lucide-react';
import { Button } from '../../components/ui';
import { useI18n } from '../../core/i18n';
import { formatDateTime } from '../../core/i18n/formatters';

export function AutoBackupConfigSection({ prefs, busy, onChangeFrequency, onCreateSnapshotNow }) {
  const { t, language } = useI18n();
  const lastTime = prefs.lastRunAt ? formatDateTime(prefs.lastRunAt, language) : null;

  return (
    <>
      <div className="settings-row">
        <div className="settings-row-info">
          <span className="settings-row-label">{t('common.autoBackup.frequencyLabel')}</span>
        </div>
        <select
          className="form-input auto-backup-frequency"
          value={prefs.frequency}
          onChange={(e) => onChangeFrequency(e.target.value)}
          disabled={busy}
        >
          <option value="daily">{t('common.autoBackup.frequencyDaily')}</option>
          <option value="weekly">{t('common.autoBackup.frequencyWeekly')}</option>
        </select>
      </div>

      <div className="settings-row">
        <div className="settings-row-info">
          <span className="settings-row-label">
            {lastTime ? t('common.autoBackup.lastSnapshot', { time: lastTime }) : t('common.autoBackup.noSnapshots')}
          </span>
          <span className="settings-row-desc">{t('common.autoBackup.retentionNote')}</span>
        </div>
        <Button
          variant="secondary"
          size="sm"
          icon={<Plus size={15} />}
          onClick={onCreateSnapshotNow}
          disabled={busy}
        >
          {busy ? t('common.autoBackup.creating') : t('common.autoBackup.createNow')}
        </Button>
      </div>
    </>
  );
}
