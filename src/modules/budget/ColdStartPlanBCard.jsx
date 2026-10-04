import React from 'react';
import { Zap, Check } from 'lucide-react';
import './ColdStartActionCard.css';

export function ColdStartPlanBCard({
  planBAmountFormatted,
  phasesList = [],
  isActive = false,
  onToggle,
  t,
}) {
  return (
    <div className={`cold-start-action-card plan-b-card ${isActive ? 'card-active' : ''}`}>
      <div className="action-card-header">
        <div className="action-card-badge plan-b-badge">
          <Zap size={14} />
          <span>{t('budget.coldStart.planBTitlePrefix')}</span>
        </div>
        <button
          type="button"
          className={`plan-b-status-pill ${isActive ? 'status-active' : ''}`}
          onClick={onToggle}
        >
          {isActive ? (
            <>
              <Check size={12} strokeWidth={3} />
              <span>{t('budget.coldStart.planBActive')}</span>
            </>
          ) : (
            <span>{t('budget.coldStart.planBActivate')}</span>
          )}
        </button>
      </div>

      <div className="action-card-value plan-b-value">
        {planBAmountFormatted} <small className="text-subtle">{t('expenses.viewMode.perMonth')}</small>
      </div>

      <ul className="action-card-list">
        {phasesList.map((item, idx) => (
          <li key={idx}>{item}</li>
        ))}
      </ul>

      <button
        type="button"
        className={`action-card-btn plan-b-btn ${isActive ? 'btn-active' : ''}`}
        onClick={(e) => {
          e.stopPropagation();
          onToggle();
        }}
      >
        <Zap size={14} />
        <span>
          {isActive
            ? `${t('budget.coldStart.planBTitlePrefix')} ${t('budget.coldStart.planBActive')}`
            : t('budget.coldStart.activatePlanB')}
        </span>
      </button>
    </div>
  );
}
