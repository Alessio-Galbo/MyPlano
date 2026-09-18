import React, { useState, useEffect } from 'react';
import { Check } from 'lucide-react';
import { Button } from '../../components/ui';
import { useI18n } from '../../core/i18n';

export function ValueSaveBox({
  icon,
  label,
  value = 0,
  onSave,
  saveButtonText,
  placeholder,
  extraAction,
}) {
  const { t } = useI18n();
  const [val, setVal] = useState(value ? String(value) : '');
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    setVal(value ? String(value) : '');
  }, [value]);

  const handleSave = () => {
    const num = parseFloat(val) || 0;
    onSave(num);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  return (
    <div className="income-input-box">
      {icon}
      <div className="income-box-details">
        <span className="income-box-label">{label}</span>
        <div className="income-field-row">
          <input
            type="number"
            step="0.01"
            min="0"
            className="income-number-input"
            value={val}
            placeholder={placeholder || '0,00'}
            onChange={(e) => setVal(e.target.value)}
            onBlur={handleSave}
          />
          <Button
            type="button"
            size="sm"
            variant={isSaved ? 'secondary' : 'primary'}
            icon={isSaved ? <Check size={14} /> : null}
            onClick={handleSave}
          >
            {isSaved ? t('common.actions.saved') : saveButtonText}
          </Button>
        </div>
        {extraAction}
      </div>
    </div>
  );
}
