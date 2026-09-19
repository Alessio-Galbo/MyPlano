import React from 'react';
import { ChevronLeft, Paperclip } from 'lucide-react';
import { formatDate } from '../documents/documentHelpers';
import { saveReceiptToArchive } from '../../core/storage/archiveService';
import { ExpenseAttachmentCard } from './ExpenseAttachmentCard';
import { ExpenseAttachmentUploadBox } from './ExpenseAttachmentUploadBox';
import './ExpenseAttachmentsCol.css';

export function ExpenseAttachmentsCol({
  expense,
  dueDate,
  attachments = [],
  onUpdateAttachments,
  onRequestDeleteAttachment,
  onBackToInstallments,
  t,
}) {
  if (!expense || !dueDate) {
    return (
      <div className="att-col-container empty-selection">
        <Paperclip size={28} className="att-col-empty-icon" />
        <p className="att-col-empty-msg">{t('expenses.databaseHub.noAttachments')}</p>
      </div>
    );
  }

  const handleFiles = async (files) => {
    if (!files || files.length === 0) return;
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
    onUpdateAttachments(dueDate, [...attachments, ...newRecords]);
  };

  const formattedDate = formatDate(dueDate);

  return (
    <div className="att-col-container">
      {onBackToInstallments && (
        <button type="button" className="att-col-mobile-back" onClick={onBackToInstallments}>
          <ChevronLeft size={16} />
          <span>{t('expenses.databaseHub.backToInstallments')}</span>
        </button>
      )}

      <div className="att-col-header">
        <h5 className="att-col-title">
          {t('expenses.databaseHub.attachmentsForInstallment').replace('{date}', formattedDate)}
        </h5>
        <span className="att-col-count-badge">{attachments.length}</span>
      </div>

      <ExpenseAttachmentUploadBox onFilesSelected={handleFiles} t={t} />

      <div className="att-col-files-list">
        {attachments.length === 0 ? (
          <div className="att-col-empty-card">
            {t('expenses.databaseHub.noAttachments')}
          </div>
        ) : (
          attachments.map((att) => (
            <ExpenseAttachmentCard
              key={att.id || att.name}
              att={att}
              onRequestDelete={(a) => onRequestDeleteAttachment(dueDate, a)}
              t={t}
            />
          ))
        )}
      </div>
    </div>
  );
}
