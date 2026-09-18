import React from 'react';
import { Modal, Button } from '../../components/ui';
import { useI18n } from '../../core/i18n';
import './DepositAllConfirmModal.css';

export function DepositAllConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  profilesWithQuota = [],
  totalMonthlyQuota = 0,
}) {
  const { t } = useI18n();
  const formatCurr = (v) =>
    Number(v || 0).toLocaleString('it-IT', { style: 'currency', currency: 'EUR' });

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={t('budget.depositAllModal.title')}>
      <div className="deposit-all-modal-body">
        <p className="deposit-all-desc">{t('budget.depositAllModal.desc')}</p>

        <div className="deposit-all-list">
          {profilesWithQuota.map((p) => (
            <div key={p.id} className="deposit-all-item">
              <span className="deposit-all-item-name">{p.name}</span>
              <strong className="deposit-all-item-val">+{formatCurr(p.effectiveQuota)}</strong>
            </div>
          ))}

          <div className="deposit-all-total-row">
            <span>{t('budget.depositAllModal.totalLabel')}</span>
            <strong className="deposit-all-total-val">+{formatCurr(totalMonthlyQuota)}</strong>
          </div>
        </div>

        <div className="deposit-all-actions">
          <Button type="button" variant="secondary" onClick={onClose}>
            {t('common.actions.cancel')}
          </Button>
          <Button type="button" variant="primary" onClick={onConfirm}>
            {t('budget.depositAllModal.confirmBtn')}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
