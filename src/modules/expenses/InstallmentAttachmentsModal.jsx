import React, { useRef } from 'react';
import { Plus } from 'lucide-react';
import { Modal, Button } from '../../components/ui';
import { useI18n } from '../../core/i18n';
import { formatDate } from '../documents/documentHelpers';
import { saveReceiptToArchive } from '../../core/storage/archiveService';
import { InstallmentAttachmentItem } from './InstallmentAttachmentItem';
import './InstallmentAttachmentsModal.css';

export function InstallmentAttachmentsModal({
  isOpen,
  onClose,
  expense,
  dueDate,
  attachments = [],
  onUpdateAttachments,
}) {
  const { t } = useI18n();
  const fileInputRef = useRef(null);

  if (!expense || !isOpen) return null;

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

  const handleDelete = (idOrName) => {
    onUpdateAttachments(attachments.filter((a) => (a.id || a.name) !== idOrName));
  };

  const modalTitle = `${expense.title} - ${t('expenses.attachmentsModal.title')} (${formatDate(dueDate)})`;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={modalTitle}>
      <div className="att-modal-container">
        <div className="att-upload-box">
          <Button
            variant="primary"
            size="sm"
            icon={<Plus size={15} />}
            onClick={() => fileInputRef.current?.click()}
          >
            {t('expenses.attachmentsModal.addFiles')}
          </Button>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/*,.pdf"
            className="receipt-hidden-input"
            onChange={handleFiles}
          />
          <span className="att-upload-hint">{t('expenses.attachmentsModal.hint')}</span>
        </div>

        <div className="att-list">
          {attachments.length === 0 ? (
            <div className="att-empty-state">{t('expenses.attachmentsModal.empty')}</div>
          ) : (
            attachments.map((att) => (
              <InstallmentAttachmentItem
                key={att.id || att.name}
                att={att}
                onDelete={handleDelete}
                t={t}
              />
            ))
          )}
        </div>

        <div className="att-modal-footer">
          <Button variant="secondary" onClick={onClose}>
            {t('common.actions.close')}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
