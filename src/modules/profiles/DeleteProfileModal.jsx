import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { Modal, Button } from '../../components/ui';
import { useI18n } from '../../core/i18n';

export function DeleteProfileModal({
  isOpen,
  onClose,
  profile,
  expensesCount = 0,
  documentsCount = 0,
  onConfirmDelete,
}) {
  const { t } = useI18n();

  if (!profile) return null;

  const desc = t('common.profiles.deleteConfirmDesc').replace('{name}', profile.name);
  const warning = t('common.profiles.deleteCascadeWarning')
    .replace('{expensesCount}', expensesCount)
    .replace('{documentsCount}', documentsCount);

  const handleConfirm = () => {
    onConfirmDelete(profile.id);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={t('common.profiles.deleteConfirmTitle')}>
      <div className="renew-modal-content">
        <div className="profile-delete-warning-box">
          <AlertTriangle size={24} className="val-negative" />
          <div className="profile-delete-warning-texts">
            <strong className="text-main">{desc}</strong>
            <p className="text-subtle text-sm">{warning}</p>
          </div>
        </div>

        <div className="form-actions">
          <Button variant="secondary" onClick={onClose}>
            {t('common.actions.cancel')}
          </Button>
          <Button variant="danger" onClick={handleConfirm}>
            {t('common.profiles.deleteButton')}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
