import React, { useState, useEffect } from 'react';
import { Modal, Button } from '../../components/ui';
import { useI18n } from '../../core/i18n';
import { formatDate, calculateRenewalDate } from './documentHelpers';
import './DocumentRenewModal.css';

export function DocumentRenewModal({ isOpen, onClose, document, onConfirmRenew }) {
  const { t } = useI18n();
  const [newDate, setNewDate] = useState('');

  useEffect(() => {
    if (document) {
      setNewDate(calculateRenewalDate(document.expiryDate, 5));
    }
  }, [document, isOpen]);

  if (!document) return null;

  const handlePreset = (years) => {
    setNewDate(calculateRenewalDate(document.expiryDate, years));
  };

  const handleConfirm = () => {
    if (newDate) {
      onConfirmRenew(document, newDate);
      onClose();
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={t('documents.renew.title')}>
      <div className="renew-modal-content">
        <div className="renew-info-card">
          <span className="renew-doc-title">{document.title}</span>
          <span className="renew-current-date">
            {t('documents.renew.currentExpiry')}: {formatDate(document.expiryDate)}
          </span>
        </div>

        <div>
          <span className="renew-presets-title">{t('documents.renew.chooseDuration')}</span>
          <div className="renew-presets-grid">
            {[1, 3, 5, 10].map((yr) => (
              <button
                key={yr}
                type="button"
                className="renew-preset-btn"
                onClick={() => handlePreset(yr)}
              >
                {yr === 1 ? t('common.actions.yearsPlusOne', { n: yr }) : t('common.actions.yearsPlusMany', { n: yr })}
              </button>
            ))}
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">{t('documents.renew.newExpiry')}</label>
          <input
            type="date"
            className="form-input"
            value={newDate}
            onChange={(e) => setNewDate(e.target.value)}
          />
        </div>

        <div className="renew-preview-box">
          <span className="renew-preview-label">{t('documents.renew.newExpiry')}:</span>
          <strong className="renew-preview-val">{formatDate(newDate)}</strong>
        </div>

        <div className="form-actions">
          <Button variant="secondary" onClick={onClose}>
            {t('common.actions.cancel')}
          </Button>
          <Button variant="primary" onClick={handleConfirm}>
            {t('documents.renew.confirm')}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
