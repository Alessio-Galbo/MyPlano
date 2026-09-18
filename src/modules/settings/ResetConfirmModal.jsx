import React from 'react';
import { AlertTriangle, Trash2, RotateCcw } from 'lucide-react';
import { Modal, Button } from '../../components/ui';
import { useI18n } from '../../core/i18n';

export function ResetConfirmModal({ isOpen, onClose, onConfirm, type }) {
  const { t } = useI18n();
  const isWipe = type === 'wipe';

  const title = t(isWipe ? 'common.settings.confirmWipeTitle' : 'common.settings.confirmFactoryTitle');
  const desc = t(isWipe ? 'common.settings.confirmWipeDesc' : 'common.settings.confirmFactoryDesc');
  const btnText = t(isWipe ? 'common.settings.confirmWipeButton' : 'common.settings.confirmFactoryButton');

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title}>
      <div className="reset-modal-content">
        <div className={`reset-modal-banner ${isWipe ? 'danger' : 'warning'}`}>
          <AlertTriangle size={24} className="reset-modal-icon" />
          <p className="reset-modal-desc">{desc}</p>
        </div>
        <div className="reset-modal-actions">
          <Button variant="ghost" onClick={onClose}>
            {t('common.actions.cancel')}
          </Button>
          <Button
            variant={isWipe ? 'danger' : 'primary'}
            icon={isWipe ? <Trash2 size={16} /> : <RotateCcw size={16} />}
            onClick={onConfirm}
          >
            {btnText}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
