import React from 'react';
import { useI18n } from '../../core/i18n';
import './TimelineHorizonSelector.css';

const PRESETS = [
  { months: 6, key: 'budget.simulation.horizon6m' },
  { months: 12, key: 'budget.simulation.horizon12m' },
  { months: 24, key: 'budget.simulation.horizon24m' },
  { months: 36, key: 'budget.simulation.horizon36m' },
  { months: 60, key: 'budget.simulation.horizon60m' },
];

export function TimelineHorizonSelector({ horizon, onChange }) {
  const { t } = useI18n();

  const handleCustomChange = (e) => {
    const val = parseInt(e.target.value, 10);
    if (!isNaN(val) && val > 0) {
      onChange(Math.min(val, 120));
    }
  };

  return (
    <div className="horizon-selector-container">
      <div className="horizon-presets">
        {PRESETS.map((p) => (
          <button
            key={p.months}
            type="button"
            className={`horizon-btn ${horizon === p.months ? 'active' : ''}`}
            onClick={() => onChange(p.months)}
          >
            {t(p.key)}
          </button>
        ))}
      </div>

      <div className="horizon-custom">
        <label htmlFor="custom-horizon-input" className="horizon-custom-label">
          {t('budget.simulation.customLabel')}
        </label>
        <div className="horizon-stepper">
          <button
            type="button"
            className="horizon-step-btn"
            onClick={() => onChange(Math.max(1, horizon - 1))}
            title="-1"
          >
            -
          </button>
          <input
            id="custom-horizon-input"
            type="number"
            min="1"
            max="120"
            value={horizon}
            onChange={handleCustomChange}
            className="horizon-number-input"
          />
          <button
            type="button"
            className="horizon-step-btn"
            onClick={() => onChange(Math.min(120, horizon + 1))}
            title="+1"
          >
            +
          </button>
        </div>
        <span className="horizon-unit">{t('budget.simulation.horizonMonths')}</span>
      </div>
    </div>
  );
}
