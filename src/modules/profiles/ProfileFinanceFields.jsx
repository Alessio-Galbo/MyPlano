import React from 'react';
import { useI18n } from '../../core/i18n';

// Starting fund and monthly income, asked only when a profile is created
// (afterwards they are edited in the Budget tab).
export function ProfileFinanceFields({ initialBalance, monthlyIncome, onChangeBalance, onChangeIncome }) {
  const { t } = useI18n();
  return (
    <div className="form-row">
      <div className="form-group">
        <label htmlFor="profile-balance-input" className="form-label">
          {t('common.profiles.initialFund')}
        </label>
        <input
          id="profile-balance-input"
          type="number"
          step="0.01"
          min="0"
          className="form-input"
          value={initialBalance}
          onChange={(e) => onChangeBalance(e.target.value)}
          placeholder="0.00"
        />
      </div>

      <div className="form-group">
        <label htmlFor="profile-income-input" className="form-label">
          {t('common.profiles.monthlyIncome')}
        </label>
        <input
          id="profile-income-input"
          type="number"
          step="0.01"
          min="0"
          className="form-input"
          value={monthlyIncome}
          onChange={(e) => onChangeIncome(e.target.value)}
          placeholder="0.00"
        />
      </div>
    </div>
  );
}
