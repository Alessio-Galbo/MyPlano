import React, { useState, useEffect } from 'react';
import { Check } from 'lucide-react';
import { Button, Toggle } from '../../components/ui';
import { useI18n } from '../../core/i18n';

export function ProfileDedicatedFinanceBox({
  icon,
  label,
  usesDedicated = false,
  onToggleDedicated,
  value = 0,
  onSave,
  checkboxLabel,
  sharedNotice,
  fallbackValue = 0,
  saveButtonText,
}) {
  const { t } = useI18n();
  const [val, setVal] = useState(String(value || 0));
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    setVal(String(value || 0));
  }, [value]);

  const handleSave = () => {
    onSave(parseFloat(val) || 0);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  const formatCurr = (v) =>
    Number(v || 0).toLocaleString('it-IT', { style: 'currency', currency: 'EUR' });

  const toggleId = `toggle-dedicated-${label.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase()}`;

  return (
    <div className="profile-dedicated-box">
      <div className="profile-dedicated-header">
        <div className="profile-dedicated-title-wrap">
          {icon}
          <span className="profile-dedicated-label">{label}</span>
        </div>
        <Toggle
          checked={usesDedicated}
          onChange={onToggleDedicated}
          label={checkboxLabel}
          id={toggleId}
        />
      </div>

      <div className="profile-dedicated-body">
        {usesDedicated ? (
          <div className="profile-dedicated-active-row">
            <div className="profile-dedicated-input-wrap">
              <span className="profile-dedicated-currency">€</span>
              <input
                type="number"
                step="0.01"
                min="0"
                className="profile-dedicated-number-input"
                value={val}
                onChange={(e) => setVal(e.target.value)}
                onBlur={handleSave}
              />
            </div>
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
        ) : (
          <div className="fund-shared-display">
            <span className="fund-shared-notice">{sharedNotice}</span>
            <strong className="fund-shared-value">{formatCurr(fallbackValue)}</strong>
          </div>
        )}
      </div>
    </div>
  );
}
