import React, { useState, useEffect } from 'react';
import { Wallet, Check } from 'lucide-react';
import { Button } from '../../components/ui';
import { useI18n } from '../../core/i18n';
import './InitialBalanceCard.css';

export function InitialBalanceCard({ initialBalance, onSaveInitialBalance }) {
  const { t } = useI18n();
  const [val, setVal] = useState(String(initialBalance || 0));
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    setVal(String(initialBalance || 0));
  }, [initialBalance]);

  const handleSave = (e) => {
    e.preventDefault();
    onSaveInitialBalance(parseFloat(val) || 0);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  return (
    <div className="initial-balance-card">
      <div className="initial-balance-info">
        <div className="initial-balance-icon">
          <Wallet size={22} />
        </div>
        <div className="initial-balance-text">
          <h4 className="initial-balance-title">
            {t('budget.initialBalance.title')}
          </h4>
          <p className="initial-balance-desc">
            {t('budget.initialBalance.desc')}
          </p>
        </div>
      </div>

      <form className="initial-balance-form" onSubmit={handleSave}>
        <input
          type="number"
          step="0.01"
          min="0"
          className="initial-balance-input"
          value={val}
          onChange={(e) => setVal(e.target.value)}
        />
        <Button
          type="submit"
          variant={isSaved ? 'secondary' : 'primary'}
          size="sm"
          icon={isSaved ? <Check size={14} /> : null}
        >
          {isSaved ? t('common.actions.saved') : t('common.actions.save')}
        </Button>
      </form>
    </div>
  );
}
