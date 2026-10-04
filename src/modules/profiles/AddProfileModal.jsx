import React, { useState } from 'react';
import { Modal, Button } from '../../components/ui';
import { useI18n } from '../../core/i18n';
import { ProfileNameField } from './ProfileNameField';
import { isDuplicateName } from './profileNames';
import { ProfileColorPicker } from './ProfileColorPicker';
import { ProfileFinanceFields } from './ProfileFinanceFields';
import './AddProfileModal.css';

// Create a profile, or edit name/colour of `profile` when given (fund and income
// stay in the Budget tab). Mount it only while open so the fields start fresh.
export function AddProfileModal({ isOpen, onClose, onAddProfile, onUpdateProfile, profile = null, profiles = [] }) {
  const { t } = useI18n();
  const isEdit = Boolean(profile);
  const [name, setName] = useState(profile?.name || '');
  const [hue, setHue] = useState(Number.isFinite(profile?.hue) ? profile.hue : null);
  const [initialBalance, setInitialBalance] = useState('');
  const [monthlyIncome, setMonthlyIncome] = useState('');
  const isDuplicate = isDuplicateName(name, profiles, profile?.id ?? null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    if (isEdit) {
      onUpdateProfile(profile.id, { name: name.trim(), hue });
    } else {
      onAddProfile({
        name: name.trim(),
        ...(hue !== null && { hue }),
        initialBalance: parseFloat(initialBalance) || 0,
        monthlyIncome: parseFloat(monthlyIncome) || 0,
      });
    }
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={t(isEdit ? 'common.profiles.editProfile' : 'common.profiles.addProfile')}
    >
      <form onSubmit={handleSubmit}>
        <ProfileNameField value={name} onChange={setName} isDuplicate={isDuplicate} />
        <ProfileColorPicker value={hue} onChange={setHue} />
        {isEdit ? (
          <p className="profile-edit-hint">{t('common.profiles.editHint')}</p>
        ) : (
          <ProfileFinanceFields
            initialBalance={initialBalance}
            monthlyIncome={monthlyIncome}
            onChangeBalance={setInitialBalance}
            onChangeIncome={setMonthlyIncome}
          />
        )}

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
