import React, { useState, useEffect } from 'react';
import { Modal, Button, useToast } from '../../components/ui';
import { useI18n } from '../../core/i18n';
import { ExpenseFormFields } from './ExpenseFormFields';
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

export function ExpenseFormModal({ isOpen, onClose, onSave, editingExp, profiles, expenses = [] }) {
  const { t } = useI18n();
  const toast = useToast();
  const [formData, setFormData] = useState(DEFAULT_EXP);

  useEffect(() => {
    if (editingExp) {
      setFormData(editingExp);
    } else {
      setFormData({
        ...DEFAULT_EXP,
        profileId: profiles[0]?.id || '',
      });
    }
  }, [editingExp, profiles, isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
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
        />
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
