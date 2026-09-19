import React from 'react';
import { FileText, Image as ImageIcon, Eye, Trash2 } from 'lucide-react';
import { openReceiptFromArchive } from '../../core/storage/archiveService';

export function InstallmentAttachmentItem({ att, onDelete, t }) {
  const formatSize = (bytes) => {
    if (!bytes) return '';
    return bytes > 1024 * 1024
      ? `${(bytes / (1024 * 1024)).toFixed(1)} MB`
      : `${Math.round(bytes / 1024)} KB`;
  };

  const isPdf = att.type?.includes('pdf');

  return (
    <div className="att-item-card">
      <div className="att-item-icon">
        {isPdf ? <FileText size={20} className="pdf-icon" /> : <ImageIcon size={20} className="img-icon" />}
      </div>
      <div className="att-item-info">
        <span className="att-item-name" title={att.name}>{att.name}</span>
        <span className="att-item-meta">{formatSize(att.size)}</span>
      </div>
      <div className="att-item-actions">
        <button
          type="button"
          className="att-action-btn open"
          onClick={() => openReceiptFromArchive(att)}
          title={t('expenses.history.viewReceipt')}
        >
          <Eye size={15} />
        </button>
        <button
          type="button"
          className="att-action-btn delete"
          onClick={() => onDelete(att.id || att.name)}
          title={t('common.actions.delete')}
        >
          <Trash2 size={15} />
        </button>
      </div>
    </div>
  );
}
