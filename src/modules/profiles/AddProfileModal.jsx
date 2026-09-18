import React, { useState } from 'react';
import { Modal, Button } from '../../components/ui';
import { useI18n } from '../../core/i18n';
import './AddProfileModal.css';

export function AddProfileModal({ isOpen, onClose, onAddProfile }) {
  const [name, setName] = useState('');
  const [initialBalance, setInitialBalance] = useState('');
  const [monthlyIncome, setMonthlyIncome] = useState('');
  const { t } = useI18n();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    onAddProfile({
      name: name.trim(),
      initialBalance: parseFloat(initialBalance) || 0,
      monthlyIncome: parseFloat(monthlyIncome) || 0,
    });
    setName('');
    setInitialBalance('');
    setMonthlyIncome('');
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={t('common.profiles.addProfile')}
    >
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="profile-name-input" className="form-label">
            {t('common.profiles.profileName')}
          </label>
          <input
            id="profile-name-input"
            type="text"
            className="form-input"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={t('common.profiles.profileName')}
            autoFocus
            required
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="profile-balance-input" className="form-label">
              {t('common.profiles.initialFund')}
            </label>
            <input
              id="profile-balance-input"
              type="number"
              step="0.01"
              min="0"
              className="form-input"
              value={initialBalance}
              onChange={(e) => setInitialBalance(e.target.value)}
              placeholder="0.00"
            />
          </div>

          <div className="form-group">
            <label htmlFor="profile-income-input" className="form-label">
              {t('common.profiles.monthlyIncome')}
            </label>
            <input
              id="profile-income-input"
              type="number"
              step="0.01"
              min="0"
              className="form-input"
              value={monthlyIncome}
              onChange={(e) => setMonthlyIncome(e.target.value)}
              placeholder="0.00"
            />
          </div>
        </div>

        <div className="form-actions">
          <Button variant="secondary" onClick={onClose}>
            {t('common.actions.cancel')}
          </Button>
          <Button type="submit" variant="primary">
            {t('common.actions.save')}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
