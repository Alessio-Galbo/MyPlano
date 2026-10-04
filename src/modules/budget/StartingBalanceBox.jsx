import React, { useState, useEffect } from 'react';
import { Wallet, Check } from 'lucide-react';
import { Button } from '../../components/ui';
import { useI18n, formatCurrency } from '../../core/i18n';

export function StartingBalanceBox({
  selectedProfileId = 'all',
  profileName,
  usesDedicatedFund = false,
  onToggleDedicated,
  fundAmount = 0,
  onSaveFund,
}) {
  const { t } = useI18n();
  const [val, setVal] = useState(String(fundAmount || 0));
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    setVal(String(fundAmount || 0));
  }, [fundAmount]);

  const save = () => {
    const num = parseFloat(val) || 0;
    onSaveFund(num);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  const isProfileMode = selectedProfileId !== 'all';
  const label = !isProfileMode
    ? t('budget.incomeHub.startingReserve')
    : usesDedicatedFund
    ? `${t('budget.incomeHub.dedicatedFund')} (${profileName})`
    : `${t('budget.incomeHub.mainFund')} (${t('budget.incomeHub.sharedFundNotice')})`;

  return (
    <div className="income-input-box">
      <Wallet size={24} className="income-box-icon" />
      <div className="income-box-details">
        <span className="income-box-label">{label}</span>

        {isProfileMode && (
          <label className="checkbox-label fund-dedicated-toggle">
            <input
              type="checkbox"
              checked={usesDedicatedFund}
              onChange={(e) => onToggleDedicated(e.target.checked)}
            />
            <span className="text-subtle">{t('budget.incomeHub.useDedicatedFund')}</span>
          </label>
        )}

        {(!isProfileMode || usesDedicatedFund) ? (
          <div className="income-field-row">
            <input
              type="number"
              step="0.01"
              min="0"
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
              {isSaved ? t('common.actions.saved') : t('budget.incomeHub.saveBalance')}
            </Button>
          </div>
        ) : (
          <div className="fund-shared-display">
            <span className="fund-shared-value">
              {formatCurrency(fundAmount)}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
