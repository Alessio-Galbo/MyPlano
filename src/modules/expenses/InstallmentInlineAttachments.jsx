import React, { useRef } from 'react';
import { Plus, FileText, Image as ImageIcon, X } from 'lucide-react';
import { saveReceiptToArchive, openReceiptFromArchive } from '../../core/storage/archiveService';
import './InstallmentInlineAttachments.css';

export function InstallmentInlineAttachments({
  expense,
  dueDate,
  attachments = [],
  onUpdateAttachments,
  t,
}) {
  const fileInputRef = useRef(null);

  const handleFiles = async (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;
    const newRecords = [];
    for (let i = 0; i < files.length; i++) {
      const rec = await saveReceiptToArchive({
        file: files[i],
        expense,
        dueDate,
        index: attachments.length + i + 1,
      });
      if (rec) newRecords.push(rec);
    }
    onUpdateAttachments([...attachments, ...newRecords]);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleDelete = (e, idOrName) => {
    e.stopPropagation();
    onUpdateAttachments(attachments.filter((a) => (a.id || a.name) !== idOrName));
  };

  return (
    <div className="inline-att-container">
      {attachments.map((att) => (
        <div
          key={att.id || att.name}
          className="inline-att-chip"
          onClick={() => openReceiptFromArchive(att)}
          title={`${att.name} (${t('expenses.history.viewReceipt')})`}
        >
          {att.type?.includes('pdf') ? (
            <FileText size={13} className="inline-att-icon pdf" />
          ) : (
            <ImageIcon size={13} className="inline-att-icon img" />
          )}
          <span className="inline-att-name">{att.name}</span>
          <button
            type="button"
            className="inline-att-remove"
            onClick={(e) => handleDelete(e, att.id || att.name)}
            title={t('common.actions.delete')}
          >
            <X size={12} />
          </button>
        </div>
      ))}

      <button
        type="button"
        className="inline-att-add-btn"
        onClick={() => fileInputRef.current?.click()}
        title={t('expenses.databaseHub.uploadReceipt')}
      >
        <Plus size={13} />
        <span>{t('expenses.databaseHub.uploadReceipt')}</span>
      </button>

      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="image/*,.pdf"
        className="receipt-hidden-input"
        onChange={handleFiles}
      />
    </div>
  );
}
