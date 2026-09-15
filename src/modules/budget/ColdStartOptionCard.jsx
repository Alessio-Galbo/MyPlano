import React from 'react';
import { Check } from 'lucide-react';
import './ColdStartOptionCard.css';

export function ColdStartOptionCard({
  id,
  title,
  amountFormatted,
  isMonthly = false,
  desc,
  isActive = false,
  onClick,
}) {
  return (
    <div
      role="button"
      tabIndex={0}
      className={`cold-start-option-card ${isActive ? 'option-active' : ''}`}
      onClick={() => onClick(id)}
      onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onClick(id)}
    >
      <div className="option-header-row">
        <span className="cold-start-metric-label">{title}</span>
        <div className={`strategy-radio-dot ${isActive ? 'radio-active' : ''}`}>
          {isActive && <Check size={11} strokeWidth={3} />}
        </div>
      </div>
      <div className="cold-start-metric-value">
        {amountFormatted} {isMonthly ? <small className="text-subtle">/ mese</small> : ''}
      </div>
      <span className="cold-start-metric-desc">{desc}</span>
    </div>
  );
}
