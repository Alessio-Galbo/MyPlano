import { diffDays, todayISO } from '../../core/dates/isoDate';
import { formatDateTime } from '../../core/i18n/formatters';

// Literal keys so Tools/check_i18n_keys.py can verify every message.
export function backupMessageText(t, code) {
  const texts = {
    exported: t('common.backup.exported'),
    restored: t('common.backup.restored'),
    errInvalidJson: t('common.backup.errInvalidJson'),
    errInvalidFormat: t('common.backup.errInvalidFormat'),
    errNewerVersion: t('common.backup.errNewerVersion'),
    errMissingProfiles: t('common.backup.errMissingProfiles'),
    errInvalidData: t('common.backup.errInvalidData'),
    errInvalidAttachments: t('common.backup.errInvalidAttachments'),
    errWriteFailed: t('common.backup.errWriteFailed'),
    errAttachmentsFailed: t('common.backup.errAttachmentsFailed'),
    errReadFailed: t('common.backup.errReadFailed'),
    errExportFailed: t('common.backup.errExportFailed'),
    errRestoreFailed: t('common.backup.errRestoreFailed'),
  };
  return texts[code] || texts.errInvalidFormat;
}

export const BACKUP_REMINDER_DAYS = 30;

// { text, stale } for "Last backup: N days ago".
export function lastBackupText(t, lastBackupAt) {
  if (!lastBackupAt) return { text: t('common.backup.lastBackupNever'), stale: true };
  const days = diffDays(lastBackupAt, todayISO());
  if (!Number.isFinite(days)) return { text: t('common.backup.lastBackupNever'), stale: true };
  if (days <= 0) return { text: t('common.backup.lastBackupToday'), stale: false };
  if (days === 1) return { text: t('common.backup.lastBackupYesterday'), stale: false };
  return { text: t('common.backup.lastBackupDays').replace('{days}', days), stale: days > BACKUP_REMINDER_DAYS };
}

export function importSummaryText(t, meta, language) {
  const date = meta.exportedAt && !Number.isNaN(Date.parse(meta.exportedAt))
    ? formatDateTime(meta.exportedAt, language)
    : t('common.backup.unknownDate');
  return t('common.backup.confirmMessage')
    .replace('{date}', date)
    .replace('{profiles}', meta.profiles)
    .replace('{expenses}', meta.expenses)
    .replace('{documents}', meta.documents)
    .replace('{attachments}', meta.attachments)
    + (meta.version < 3 ? ` ${t('common.backup.legacyWarning')}` : '');
}

export function attachmentsSizeText(t, size) {
  if (!size) return '';
  return t('common.backup.attachmentsDesc')
    .replace('{count}', size.count)
    .replace('{size}', Math.max(size.bytes ? 0.1 : 0, size.bytes / 1048576).toFixed(1));
}
