import React from 'react';
import { useI18n } from '../../core/i18n';
import { formatDate } from './documentHelpers';

export function DocumentCardMeta({ document }) {
  const { t } = useI18n();

  return (
    <div className="doc-card-meta">
      <div className="doc-meta-row">
        <span className="doc-meta-label">{t('documents.fields.identifier')}:</span>
        <span className="doc-meta-val">{document.identifier || '-'}</span>
      </div>
      <div className="doc-meta-row">
        <span className="doc-meta-label">{t('documents.fields.issuer')}:</span>
        <span className="doc-meta-val">{document.issuer || '-'}</span>
      </div>
      <div className="doc-meta-row">
        <span className="doc-meta-label">{t('documents.fields.expiryDate')}:</span>
        <span className="doc-meta-val">{formatDate(document.expiryDate)}</span>
      </div>
      {document.notes && (
        <div className="doc-meta-row">
          <span className="doc-meta-label">{t('documents.fields.notes')}:</span>
          <span className="doc-meta-val doc-meta-notes">{document.notes}</span>
        </div>
      )}
    </div>
  );
}
