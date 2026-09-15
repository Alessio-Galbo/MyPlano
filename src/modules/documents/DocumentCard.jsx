import React from 'react';
import { Edit2, Trash2, RefreshCw } from 'lucide-react';
import { Badge, Toggle } from '../../components/ui';
import { useI18n } from '../../core/i18n';
import { getDocumentStatus } from './documentHelpers';
import { DocumentCardMeta } from './DocumentCardMeta';
import './DocumentCard.css';

export function DocumentCard({
  document,
  profile,
  onEdit,
  onDelete,
  onToggleAlert,
  onQuickRenew,
}) {
  const { t } = useI18n();
  const { status, daysRemaining, variant } = getDocumentStatus(document.expiryDate);

  const statusLabel = status === 'expired'
    ? t('documents.status.expiredSinceShort').replace('{days}', Math.abs(daysRemaining))
    : daysRemaining === 0
      ? t('documents.status.expiresToday')
      : t('documents.status.daysShort').replace('{days}', daysRemaining);

  return (
    <div className="doc-card">
      <div className="doc-card-header">
        <div>
          <h4 className="doc-card-title">{document.title}</h4>
          <span className="text-subtle">{profile ? profile.name : ''}</span>
        </div>
        <Badge variant={variant}>{statusLabel}</Badge>
      </div>

      <DocumentCardMeta document={document} />

      <div className="doc-card-footer">
        <Toggle
          checked={document.enableAlert}
          onChange={(checked) => onToggleAlert(document.id, checked)}
          label={t('documents.fields.enableAlert')}
          id={`alert-doc-${document.id}`}
        />

        <div className="doc-actions">
          <button
            type="button"
            className="btn btn-ghost btn-sm"
            title={t('documents.quickRenew')}
            onClick={() => onQuickRenew(document)}
          >
            <RefreshCw size={15} />
          </button>
          <button
            type="button"
            className="btn btn-ghost btn-sm"
            title={t('common.actions.edit')}
            onClick={() => onEdit(document)}
          >
            <Edit2 size={15} />
          </button>
          <button
            type="button"
            className="btn btn-ghost btn-sm"
            title={t('common.actions.delete')}
            onClick={() => onDelete(document.id)}
          >
            <Trash2 size={15} />
          </button>
        </div>
      </div>
    </div>
  );
}
