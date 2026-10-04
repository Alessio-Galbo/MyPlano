import React, { useState } from 'react';
import { Button } from '../../components/ui';
import { useI18n } from '../../core/i18n';
import { todayISO } from '../../core/dates/isoDate';

export function NewContractForm({ currentContract, onSaveContract, onCancel }) {
  const { t } = useI18n();
  const [name, setName] = useState('');
  const [startDate, setStartDate] = useState(todayISO);
  const [estAmount, setEstAmount] = useState(String(currentContract?.estimatedAmount || ''));

  const handleSubmit = (e) => {
    e.preventDefault();
    onSaveContract({
      name: name.trim() || t('expenses.variable.defaultContractName'),
      startDate,
      estimatedAmount: parseFloat(estAmount) || 0,
    });
  };

  return (
    <form className="new-contract-form" onSubmit={handleSubmit}>
      <h5 className="new-contract-title">{t('expenses.variable.newContractTitle')}</h5>
      <p className="text-subtle">{t('expenses.variable.newContractHint')}</p>

      <div className="form-group">
        <label className="form-label">{t('expenses.variable.contractName')}</label>
        <input
          type="text"
          required
          className="form-input"
          placeholder={t('expenses.variable.newProviderPlaceholder')}
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>

      <div className="form-group">
        <label className="form-label">{t('expenses.variable.contractStartDate')}</label>
        <input
          type="date"
          required
          className="form-input"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
        />
      </div>

      <div className="form-group">
        <label className="form-label">{t('expenses.fields.amount')}</label>
        <input
          type="number"
          step="0.01"
          required
          className="form-input"
          value={estAmount}
          onChange={(e) => setEstAmount(e.target.value)}
        />
      </div>

      <div className="form-actions">
        <Button type="button" variant="secondary" size="sm" onClick={onCancel}>
          {t('common.actions.cancel')}
        </Button>
        <Button type="submit" variant="primary" size="sm">
          {t('expenses.variable.activateContract')}
        </Button>
      </div>
    </form>
  );
}
