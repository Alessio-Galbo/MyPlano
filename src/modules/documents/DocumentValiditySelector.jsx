import React from 'react';
import { Clock } from 'lucide-react';
import { useI18n } from '../../core/i18n';
import { addMonthsClamped, todayISO } from '../../core/dates/isoDate';
import './DocumentValiditySelector.css';

const PRESET_YEARS = [1, 3, 5, 10];

export function DocumentValiditySelector({ onSelectDuration }) {
  const { t } = useI18n();

  const handleApplyYears = (years) => {
    const dateStr = addMonthsClamped(todayISO(), years * 12);
    onSelectDuration(dateStr);
  };

  return (
    <div className="validity-selector-container">
      <div className="validity-label-row">
        <Clock size={13} className="text-muted" />
        <span className="validity-label">{t('documents.fields.quickDurationLabel')}</span>
      </div>
      <div className="validity-chips">
        {PRESET_YEARS.map((y) => (
          <button
            key={y}
            type="button"
            className="validity-chip-btn"
            onClick={() => handleApplyYears(y)}
          >
            {y === 1 ? t('common.actions.yearsPlusOne', { n: y }) : t('common.actions.yearsPlusMany', { n: y })}
          </button>
        ))}
      </div>
    </div>
  );
}
