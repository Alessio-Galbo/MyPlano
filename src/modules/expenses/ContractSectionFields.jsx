import React from 'react';
import { Zap } from 'lucide-react';
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
    <div className="variable-toggle-card">
      <label className="variable-toggle-header">
        <div className="variable-title-group">
          <Zap size={16} className="variable-icon" />
          <div>
            <div className="variable-title-text">{t('expenses.variable.isVariableLabel')}</div>
            <div className="variable-hint-text">{t('expenses.variable.isVariableHint')}</div>
          </div>
        </div>
        <input
          type="checkbox"
          checked={!!formData.isVariable}
          onChange={handleToggleVariable}
          className="variable-custom-checkbox"
        />
      </label>

      {formData.isVariable && (
        <div className="variable-details-box">
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">{t('expenses.variable.contractName')}</label>
              <input
                type="text"
                className="form-input"
                placeholder="es. Octopus / Enel"
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
        </div>
      )}
    </div>
  );
}
