import React, { useState } from 'react';
import { ShieldAlert, RotateCcw, Trash2 } from 'lucide-react';
import { Button } from '../../components/ui';
import { useI18n } from '../../core/i18n';
import { storageService } from '../../core/storage';
import { ResetConfirmModal } from './ResetConfirmModal';
import './SettingsResetCard.css';

export function SettingsResetCard({ onDataRestored }) {
  const { t } = useI18n();
  const [modalType, setModalType] = useState(null);

  const handleConfirm = async () => {
    let res = null;
    if (modalType === 'wipe') {
      res = storageService.clearAllData();
    } else if (modalType === 'factory') {
      res = storageService.resetToFactoryDefaults();
    }
    setModalType(null);
    // Reload state right away: a save during the IndexedDB cleanup must not write old data back.
    if (onDataRestored) onDataRestored();
    await res?.done; // receipts stored in IndexedDB are removed too
  };

  return (
    <div className="settings-card danger-card">
      <div className="settings-card-header">
        <ShieldAlert size={20} className="text-danger" />
        <h3 className="settings-card-title">{t('common.settings.databaseMaintenance')}</h3>
      </div>
      <p className="settings-guide-text">{t('common.settings.databaseMaintenanceDesc')}</p>

      <div className="settings-row">
        <div className="settings-row-info">
          <span className="settings-row-label">{t('common.actions.factoryReset')}</span>
          <span className="settings-row-desc">{t('common.settings.factoryResetDesc')}</span>
        </div>
        <Button
          variant="secondary"
          size="sm"
          icon={<RotateCcw size={15} />}
          onClick={() => setModalType('factory')}
        >
          {t('common.actions.factoryReset')}
        </Button>
      </div>

      <div className="settings-row">
        <div className="settings-row-info">
          <span className="settings-row-label">{t('common.actions.wipeDatabase')}</span>
          <span className="settings-row-desc">{t('common.settings.wipeDatabaseDesc')}</span>
        </div>
        <Button
          variant="danger"
          size="sm"
          icon={<Trash2 size={15} />}
          onClick={() => setModalType('wipe')}
        >
          {t('common.actions.wipeDatabase')}
        </Button>
      </div>

      <ResetConfirmModal
        isOpen={Boolean(modalType)}
        type={modalType}
        onClose={() => setModalType(null)}
        onConfirm={handleConfirm}
      />
    </div>
  );
}
