import React from 'react';
import { EXPENSE_CATEGORIES } from '../../core/types/constants';
import { useI18n } from '../../core/i18n';
import { SuggestInput } from '../../components/ui';
import { isDateInPast } from './pastDateHelpers';
import { PastDateNotice } from './PastDateNotice';
import { ContractSectionFields } from './ContractSectionFields';
import { ExpenseFrequencyField } from './ExpenseFrequencyField';
import { getCategoryLabel } from './expenseHelpers';
import { ProfileSelectField } from '../../core/profiles';

export function ExpenseFormFields({ formData, setFormData, expenses = [], profiles = [] }) {
  const { t } = useI18n();

  const allCats = Array.from(new Set([...EXPENSE_CATEGORIES, ...expenses.map((e) => e.category).filter(Boolean)]));
  const categoryOptions = allCats.map((c) => ({
    value: c, label: getCategoryLabel(c, t), count: expenses.filter((e) => e.category === c).length,
  }));

  return (
    <div className="expense-form-container">
      <div className="form-group">
        <label className="form-label">{t('expenses.fields.title')}</label>
        <input
          type="text" className="form-input" required value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
        />
      </div>

      <ProfileSelectField
        value={formData.profileId} profiles={profiles} id="expense-profile"
        onChange={(profileId) => setFormData({ ...formData, profileId })}
      />

      <div className="form-row">
        <div className="form-group">
          <label className="form-label">{t('expenses.fields.category')}</label>
          <SuggestInput
            value={formData.category || 'utilities'} onChange={(v) => setFormData({ ...formData, category: v })}
            options={categoryOptions} placeholder={t('expenses.fields.category')} required
          />
        </div>
        <div className="form-group">
          <label className="form-label">{t('expenses.fields.amount')}</label>
          <input
            type="number" step="0.01" className="form-input" required value={formData.amount}
            onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
          />
        </div>
      </div>

      <div className="form-row">
        <ExpenseFrequencyField
          frequency={formData.frequency} customInterval={formData.customInterval || 1}
          customUnit={formData.customUnit || 'months'}
          onChangeFrequency={(freq) => setFormData({ ...formData, frequency: freq })}
          onChangeCustom={(int, u) => setFormData({ ...formData, customInterval: int, customUnit: u })}
        />
        <div className="form-group">
          <label className="form-label">{t('expenses.fields.dueDate')}</label>
          <input
            type="date" className="form-input" required value={formData.nextDueDate}
            onChange={(e) => setFormData({ ...formData, nextDueDate: e.target.value })}
          />
        </div>
      </div>

      {isDateInPast(formData.nextDueDate) && (
        <PastDateNotice
          pastDate={formData.nextDueDate} frequency={formData.frequency}
          customInterval={formData.customInterval} customUnit={formData.customUnit}
          onApplyDate={(d) => setFormData({ ...formData, nextDueDate: d })}
        />
      )}

      <ContractSectionFields formData={formData} setFormData={setFormData} />
    </div>
  );
}
