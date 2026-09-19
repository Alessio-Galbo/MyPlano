import React, { useState } from 'react';
import { Button } from '../../components/ui';
import { useI18n } from '../../core/i18n';

export function FixedExtraPaymentForm({ defaultAmount, onSave, onCancel }) {
  const { t } = useI18n();
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [amount, setAmount] = useState(defaultAmount || '');
  const [note, setNote] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!date) return;
    onSave({
      date,
      amount: parseFloat(amount) || Number(defaultAmount) || 0,
      note,
    });
  };

  return (
    <form className="fixed-extra-form" onSubmit={handleSubmit}>
      <div className="fixed-extra-grid">
        <input type="date" className="form-input" required value={date} onChange={(e) => setDate(e.target.value)} />
        <input type="number" step="0.01" className="form-input" required value={amount} onChange={(e) => setAmount(e.target.value)} />
      </div>
      <input type="text" className="form-input" placeholder={t('expenses.history.extraNote')} value={note} onChange={(e) => setNote(e.target.value)} />
      <div className="fixed-extra-actions">
        <Button size="sm" variant="secondary" onClick={onCancel}>{t('expenses.history.cancel')}</Button>
        <Button size="sm" variant="primary" type="submit">{t('expenses.history.saveExtra')}</Button>
      </div>
    </form>
  );
}
