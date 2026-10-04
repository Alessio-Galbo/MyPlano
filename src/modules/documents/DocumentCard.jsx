import React, { useState } from 'react';
import { Badge, Toggle, ConfirmModal } from '../../components/ui';
import { useI18n } from '../../core/i18n';
import { getDocumentStatus } from './documentHelpers';
import { DocumentCardMeta } from './DocumentCardMeta';
import { DocumentCardActions } from './DocumentCardActions';
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
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
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
          checked={document.enableAlert !== false}
          onChange={(checked) => onToggleAlert(document.id, checked)}
          label={t('documents.fields.enableAlert')}
          id={`alert-doc-${document.id}`}
        />

        <DocumentCardActions
          title={document.title}
          onRenew={() => onQuickRenew(document)}
          onEdit={() => onEdit(document)}
          onDelete={() => setIsConfirmOpen(true)}
        />
      </div>

      <ConfirmModal
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={() => onDelete(document.id)}
        title={t('documents.deleteConfirmTitle')}
        message={t('documents.deleteConfirmMessage').replace('{title}', document.title || '')}
      />
    </div>
  );
}
