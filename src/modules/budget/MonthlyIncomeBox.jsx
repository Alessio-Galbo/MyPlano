import React, { useState, useEffect } from 'react';
import { Banknote, Check } from 'lucide-react';
import { Button } from '../../components/ui';
import { useI18n } from '../../core/i18n';

export function MonthlyIncomeBox({ monthlyIncome, onSaveMonthlyIncome }) {
  const { t } = useI18n();
  const [val, setVal] = useState(String(monthlyIncome || ''));
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    setVal(String(monthlyIncome || ''));
  }, [monthlyIncome]);

  const save = () => {
    const num = parseFloat(val) || 0;
    onSaveMonthlyIncome(num);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  return (
    <div className="income-input-box">
      <Banknote size={24} className="income-box-icon" />
      <div className="income-box-details">
        <span className="income-box-label">{t('budget.incomeHub.monthlyIncome')}</span>
        <div className="income-field-row">
          <input
            type="number"
            step="0.01"
            min="0"
            placeholder={t('budget.incomeHub.optional')}
            className="income-number-input"
            value={val}
            onChange={(e) => setVal(e.target.value)}
            onBlur={save}
          />
          <Button
            type="button"
            size="sm"
            variant={isSaved ? 'secondary' : 'primary'}
            icon={isSaved ? <Check size={14} /> : null}
            onClick={save}
          >
            {isSaved ? t('common.actions.saved') : t('budget.incomeHub.saveIncome')}
          </Button>
        </div>
      </div>
    </div>
  );
}
