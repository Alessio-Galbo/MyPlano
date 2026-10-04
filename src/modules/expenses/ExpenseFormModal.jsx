import React, { useState } from 'react';
import { Modal, Button, useToast } from '../../components/ui';
import { useI18n } from '../../core/i18n';
import { ExpenseFormFields } from './ExpenseFormFields';
import { useFormProfileReset, hasProfile } from '../../core/profiles';
import './ExpenseFormModal.css';

const DEFAULT_EXP = {
  title: '',
  amount: '',
  category: 'utilities',
  frequency: 'monthly',
  profileId: '',
  nextDueDate: '',
  enableAlert: true,
  includeInCalendar: true,
};

export function ExpenseFormModal({ isOpen, onClose, onSave, editingExp, profiles = [], expenses = [] }) {
  const { t } = useI18n();
  const toast = useToast();
  const [formData, setFormData] = useState(DEFAULT_EXP);

  useFormProfileReset({
    isOpen, editingItem: editingExp, profiles, setFormData,
    makeNew: (profileId) => ({ ...DEFAULT_EXP, profileId }),
    makeEdit: (exp) => exp,
  });
  const canSave = hasProfile(profiles, formData.profileId);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!canSave) return;
    onSave({ ...formData, amount: parseFloat(formData.amount) || 0 });
    toast.show({ message: t('common.toast.expenseSaved'), variant: 'success' });
    onClose();
  };

  const titleKey = editingExp ? 'expenses.editExpense' : 'expenses.addExpense';

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={t(titleKey)}>
      <form onSubmit={handleSubmit}>
        <ExpenseFormFields
          formData={formData}
          setFormData={setFormData}
          expenses={expenses}
          profiles={profiles}
        />
        <div className="form-actions">
          <Button variant="secondary" onClick={onClose}>
            {t('common.actions.cancel')}
          </Button>
          <Button type="submit" variant="primary" disabled={profiles.length === 0}>
            {t('common.actions.save')}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
