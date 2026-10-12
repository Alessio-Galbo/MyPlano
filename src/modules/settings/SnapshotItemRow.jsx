// Renders a single automatic snapshot item with restore, download, and delete actions.
import React from 'react';
import { RotateCcw, Download, Trash2 } from 'lucide-react';
import { Button } from '../../components/ui';
import { useI18n } from '../../core/i18n';
import { formatDateTime } from '../../core/i18n/formatters';

export function SnapshotItemRow({ snapshot, meta, onRestore, onDownload, onDelete, disabled }) {
  const { t, language } = useI18n();
  const dateFormatted = meta.createdAt ? formatDateTime(meta.createdAt, language) : '-';
  const summary = t('common.autoBackup.itemsSummary', {
    profiles: meta.profiles,
    expenses: meta.expenses,
    documents: meta.documents,
  });

  return (
    <div className="snapshot-item-row" data-testid="snapshot-item-row">
      <div className="snapshot-item-info">
        <span className="snapshot-item-date">{dateFormatted}</span>
        <span className="snapshot-item-summary">{summary}</span>
      </div>
      <div className="snapshot-item-actions">
        <Button
          variant="secondary"
          size="sm"
          icon={<RotateCcw size={14} />}
          onClick={() => onRestore(snapshot)}
          disabled={disabled}
          title={t('common.autoBackup.restoreButton')}
        >
          {t('common.autoBackup.restoreButton')}
        </Button>
        <Button
          variant="secondary"
          size="sm"
          icon={<Download size={14} />}
          onClick={() => onDownload(snapshot)}
          disabled={disabled}
          title={t('common.autoBackup.downloadButton')}
        />
        <Button
          variant="ghost"
          size="sm"
          icon={<Trash2 size={14} className="text-danger" />}
          onClick={() => onDelete(snapshot)}
          disabled={disabled}
          title={t('common.autoBackup.deleteButton')}
        />
      </div>
    </div>
  );
}
