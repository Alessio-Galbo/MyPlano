import React from 'react';
import { FileText, Image as ImageIcon, Eye, Trash2 } from 'lucide-react';
import { openReceiptFromArchive } from '../../core/storage/archiveService';
import './ExpenseAttachmentCard.css';

export function ExpenseAttachmentCard({ att, onRequestDelete, t }) {
  const formatSize = (bytes) => {
    if (!bytes) return '';
    return bytes > 1024 * 1024
      ? `${(bytes / (1024 * 1024)).toFixed(1)} MB`
      : `${Math.round(bytes / 1024)} KB`;
  };

  const isPdf = att.type?.includes('pdf');

  return (
    <div className="att-col-file-card">
      <div className="att-col-file-icon">
        {isPdf ? <FileText size={18} className="pdf-icon" /> : <ImageIcon size={18} className="img-icon" />}
      </div>
      <div className="att-col-file-info">
        <span className="att-col-file-name" title={att.name}>{att.name}</span>
        <span className="att-col-file-meta">{formatSize(att.size)}</span>
      </div>
      <div className="att-col-file-actions">
        <button
          type="button"
          className="att-col-btn view"
          onClick={() => openReceiptFromArchive(att)}
          title={t('expenses.history.viewReceipt')}
        >
          <Eye size={14} />
        </button>
        <button
          type="button"
          className="att-col-btn delete"
          onClick={() => onRequestDelete(att)}
          title={t('common.actions.delete')}
        >
          <Trash2 size={14} />
        </button>
      </div>
    </div>
  );
}
