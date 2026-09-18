import React from 'react';
import { PlusCircle, Wallet } from 'lucide-react';
import './ColdStartActionCard.css';

export function ColdStartTopUpCard({
  amountFormatted,
  standardQuotaFormatted,
  onTopUp,
  t,
}) {
  return (
    <div className="cold-start-action-card topup-card">
      <div className="action-card-header">
        <div className="action-card-badge topup-badge">
          <Wallet size={14} />
          <span>{t('budget.coldStart.topUpActionTitle')}</span>
        </div>
      </div>

      <div className="action-card-value topup-value">
        +{amountFormatted}
      </div>

      <ul className="action-card-list">
        <li>{t('budget.coldStart.topUpPointOne').replace('{amount}', amountFormatted)}</li>
        <li>{t('budget.coldStart.topUpPointTwo')}</li>
        <li>{t('budget.coldStart.topUpPointThree')}</li>
      </ul>

      <button type="button" className="action-card-btn topup-btn" onClick={onTopUp}>
        <PlusCircle size={14} />
        <span>{t('budget.coldStart.topUpActionBtn').replace('{amount}', amountFormatted)}</span>
      </button>
    </div>
  );
}
