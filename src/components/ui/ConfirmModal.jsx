import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { Modal } from './Modal';
import { Button } from './Button';
import { useI18n } from '../../core/i18n';
import './ConfirmModal.css';

export function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText,
  cancelText,
  variant = 'danger',
}) {
  const { t } = useI18n();

  if (!isOpen) return null;

  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title || t('common.actions.confirm')}
      className="confirm-modal-wrapper"
    >
      <div className="confirm-modal-content">
        <div className={`confirm-icon-badge ${variant}`}>
          <AlertTriangle size={24} />
        </div>
        <p className="confirm-message">{message}</p>
        <div className="confirm-modal-actions">
          <Button variant="secondary" onClick={onClose}>
            {cancelText || t('common.actions.cancel')}
          </Button>
          <Button variant={variant} onClick={handleConfirm}>
            {confirmText || t('common.actions.delete')}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
