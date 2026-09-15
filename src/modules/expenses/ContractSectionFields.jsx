import React from 'react';
import { useI18n } from '../../core/i18n';

export function ContractSectionFields({ formData, setFormData }) {
  const { t } = useI18n();

  const handleToggleVariable = (e) => {
    const isVariable = e.target.checked;
    setFormData({
      ...formData,
      isVariable,
      contract: isVariable
        ? formData.contract || {
            name: '',
            startDate: new Date().toISOString().split('T')[0],
            estimatedAmount: formData.amount || 0,
          }
        : formData.contract,
    });
  };

  const handleContractChange = (field, val) => {
    setFormData({
      ...formData,
      contract: {
        ...(formData.contract || {}),
        [field]: val,
      },
    });
  };

  return (
    <div className="variable-fields-section">
      <label className="checkbox-label">
        <input
          type="checkbox"
          checked={!!formData.isVariable}
          onChange={handleToggleVariable}
        />
        <span>{t('expenses.variable.isVariableLabel')}</span>
      </label>

      {formData.isVariable && (
        <div className="variable-details-box">
          <p className="text-subtle">{t('expenses.variable.isVariableHint')}</p>
          <div className="form-group">
            <label className="form-label">{t('expenses.variable.contractName')}</label>
            <input
              type="text"
              className="form-input"
              placeholder="es. Octopus Energy / Enel Flex"
              value={formData.contract?.name || ''}
              onChange={(e) => handleContractChange('name', e.target.value)}
            />
          </div>
          <div className="form-group">
            <label className="form-label">{t('expenses.variable.contractStartDate')}</label>
            <input
              type="date"
              className="form-input"
              value={formData.contract?.startDate || ''}
              onChange={(e) => handleContractChange('startDate', e.target.value)}
            />
          </div>
        </div>
      )}
    </div>
  );
}
