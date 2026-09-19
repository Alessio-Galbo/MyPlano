import React, { useRef } from 'react';
import { Paperclip, Eye, Trash2 } from 'lucide-react';
import { useI18n } from '../../core/i18n';
import { saveReceiptToArchive, openReceiptFromArchive } from '../../core/storage/archiveService';
import './ReceiptAttachmentButton.css';

export function ReceiptAttachmentButton({ receipt, expense, dueDate, onSaveReceipt, onRemoveReceipt }) {
  const { t } = useI18n();
  const fileInputRef = useRef(null);

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const rec = await saveReceiptToArchive({ file, expense, dueDate });
    if (rec) onSaveReceipt(rec);
  };

  if (receipt) {
    const displayName = receipt.name?.length > 15
      ? receipt.name.substring(0, 12) + '...'
      : (receipt.name || t('expenses.history.viewReceipt'));

    return (
      <div className="receipt-pill-group">
        <button
          type="button"
          className="receipt-view-btn"
          onClick={() => openReceiptFromArchive(receipt)}
          title={t('expenses.history.viewReceipt')}
        >
          <Eye size={12} />
          <span>{displayName}</span>
        </button>
        <button
          type="button"
          className="receipt-delete-btn"
          onClick={onRemoveReceipt}
          title={t('expenses.history.removeReceipt')}
        >
          <Trash2 size={11} />
        </button>
      </div>
    );
  }

  return (
    <>
      <button
        type="button"
        className="receipt-attach-btn"
        onClick={() => fileInputRef.current?.click()}
        title={t('expenses.history.attachReceipt')}
      >
        <Paperclip size={12} />
        <span>{t('expenses.history.attach')}</span>
      </button>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*,.pdf"
        className="receipt-hidden-input"
        onChange={handleFileChange}
      />
    </>
  );
}
