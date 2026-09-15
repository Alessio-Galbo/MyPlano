import React, { useState } from 'react';
import { Modal, Button } from '../../components/ui';
import { useI18n } from '../../core/i18n';
import './AddProfileModal.css';

export function AddProfileModal({ isOpen, onClose, onAddProfile }) {
  const [name, setName] = useState('');
  const { t } = useI18n();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    onAddProfile({ name: name.trim() });
    setName('');
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
