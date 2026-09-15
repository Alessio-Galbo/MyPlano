import React from 'react';
import { FREQUENCY_MULTIPLIERS } from '../../core/types/constants';
import { useI18n } from '../../core/i18n';
import './ExpenseFrequencyField.css';

export function ExpenseFrequencyField({
  frequency,
  customInterval = 1,
  customUnit = 'months',
  onChangeFrequency,
  onChangeCustom,
}) {
  const { t } = useI18n();

  return (
    <div className="form-group">
      <label className="form-label">{t('expenses.fields.frequency')}</label>
      <select
        className="form-input"
        value={frequency}
        onChange={(e) => onChangeFrequency(e.target.value)}
      >
        {Object.keys(FREQUENCY_MULTIPLIERS).map((freq) => (
          <option key={freq} value={freq}>{t(`expenses.frequencies.${freq}`)}</option>
        ))}
      </select>

      {frequency === 'custom' && (
        <div className="custom-frequency-row">
          <span className="text-subtle">{t('expenses.customFreq.every')}</span>
          <input
            type="number"
            min="1"
            max="365"
            className="form-input custom-interval-input"
            value={customInterval}
            onChange={(e) => onChangeCustom(parseInt(e.target.value, 10) || 1, customUnit)}
          />
          <select
            className="form-input custom-unit-select"
            value={customUnit}
            onChange={(e) => onChangeCustom(customInterval, e.target.value)}
          >
            <option value="months">{t('expenses.customFreq.months')}</option>
            <option value="days">{t('expenses.customFreq.days')}</option>
          </select>
        </div>
      )}
    </div>
  );
}
