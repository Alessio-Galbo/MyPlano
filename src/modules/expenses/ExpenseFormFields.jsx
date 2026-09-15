import React from 'react';
import { EXPENSE_CATEGORIES } from '../../core/types/constants';
import { useI18n } from '../../core/i18n';
import { SuggestInput } from '../../components/ui';
import { isDateInPast } from './pastDateHelpers';
import { PastDateNotice } from './PastDateNotice';
import { ContractSectionFields } from './ContractSectionFields';
import { ExpenseFrequencyField } from './ExpenseFrequencyField';
import { getCategoryLabel } from './expenseHelpers';

export function ExpenseFormFields({ formData, setFormData, expenses = [] }) {
  const { t } = useI18n();

  const allCategories = Array.from(
    new Set([...EXPENSE_CATEGORIES, ...expenses.map((e) => e.category).filter(Boolean)])
  );
  const categoryOptions = allCategories.map((cat) => ({
    value: cat,
    label: getCategoryLabel(cat, t),
    count: expenses.filter((e) => e.category === cat).length,
  }));

  return (
    <>
      <div className="form-group">
        <label className="form-label">{t('expenses.fields.title')}</label>
        <input
          type="text"
          className="form-input"
          required
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
        />
      </div>

      <div className="form-group">
        <label className="form-label">{t('expenses.fields.category')}</label>
        <SuggestInput
          value={formData.category || 'utilities'}
          onChange={(val) => setFormData({ ...formData, category: val })}
          options={categoryOptions}
          placeholder={t('expenses.fields.category')}
          required
        />
      </div>

      <div className="form-group">
        <label className="form-label">{t('expenses.fields.amount')}</label>
        <input
          type="number"
          step="0.01"
          className="form-input"
          required
          value={formData.amount}
          onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
        />
      </div>

      <ContractSectionFields formData={formData} setFormData={setFormData} />

      <ExpenseFrequencyField
        frequency={formData.frequency}
        customInterval={formData.customInterval || 1}
        customUnit={formData.customUnit || 'months'}
        onChangeFrequency={(freq) => setFormData({ ...formData, frequency: freq })}
        onChangeCustom={(interval, unit) =>
          setFormData({ ...formData, customInterval: interval, customUnit: unit })
        }
      />

      <div className="form-group">
        <label className="form-label">{t('expenses.fields.nextDueDate')}</label>
        <input
          type="date"
          className="form-input"
          required
          value={formData.nextDueDate}
          onChange={(e) => setFormData({ ...formData, nextDueDate: e.target.value })}
        />
        {isDateInPast(formData.nextDueDate) && (
          <PastDateNotice
            pastDate={formData.nextDueDate}
            frequency={formData.frequency}
            onApplyDate={(newDate) => setFormData({ ...formData, nextDueDate: newDate })}
          />
        )}
      </div>
    </>
  );
}
