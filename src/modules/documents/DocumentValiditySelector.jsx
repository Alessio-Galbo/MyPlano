import React from 'react';
import { Clock } from 'lucide-react';
import { useI18n } from '../../core/i18n';
import './DocumentValiditySelector.css';

const PRESET_YEARS = [1, 3, 5, 10];

export function DocumentValiditySelector({ onSelectDuration }) {
  const { t } = useI18n();

  const handleApplyYears = (years) => {
    const d = new Date();
    d.setFullYear(d.getFullYear() + years);
    const dateStr = d.toISOString().split('T')[0];
    onSelectDuration(dateStr);
  };

  return (
    <div className="validity-selector-container">
      <div className="validity-label-row">
        <Clock size={13} className="text-muted" />
        <span className="validity-label">Calcolo rapido durata:</span>
      </div>
      <div className="validity-chips">
        {PRESET_YEARS.map((y) => (
          <button
            key={y}
            type="button"
            className="validity-chip-btn"
            onClick={() => handleApplyYears(y)}
          >
            +{y} {y === 1 ? 'anno' : 'anni'}
          </button>
        ))}
      </div>
    </div>
  );
}
