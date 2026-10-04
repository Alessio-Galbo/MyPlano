import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '../../components/ui';
import { useI18n } from '../../core/i18n';
import { createItemId } from '../../core/storage/idMigrationHelper';
import { todayISO } from '../../core/dates/isoDate';

export function AddBillPaymentForm({ onAddPayment }) {
  const { t } = useI18n();
  const [date, setDate] = useState(todayISO);
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!amount) return;
    onAddPayment({
      id: createItemId('bill'),
      date,
      amount: parseFloat(amount) || 0,
      note: note.trim(),
    });
    setAmount('');
    setNote('');
  };

  return (
    <form className="add-bill-form" onSubmit={handleSubmit}>
      <h5 className="add-bill-title">{t('expenses.variable.addBillTitle')}</h5>
      <div className="add-bill-grid">
        <div className="form-group">
          <label className="form-label">{t('expenses.variable.billDate')}</label>
          <input
            type="date"
            required
            className="form-input"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label className="form-label">{t('expenses.variable.billAmount')}</label>
          <input
            type="number"
            step="0.01"
            required
            placeholder="0.00"
            className="form-input"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
        </div>
      </div>
      <div className="add-bill-action-row">
        <input
          type="text"
          placeholder={t('expenses.variable.billNote')}
          className="form-input flex-1"
          value={note}
          onChange={(e) => setNote(e.target.value)}
        />
        <Button type="submit" variant="primary" size="sm" icon={<Plus size={14} />}>
          {t('expenses.variable.addBillBtn')}
        </Button>
      </div>
    </form>
  );
}
