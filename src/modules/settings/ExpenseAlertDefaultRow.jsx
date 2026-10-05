import React, { useState, useSyncExternalStore } from 'react';
import { useI18n } from '../../core/i18n';
import { MAX_ALERT_DAYS } from '../../core/notifications/alertDays';
import {
  getExpenseAlertDefault, setExpenseAlertDefault, subscribeExpenseAlertDefault,
} from '../../core/storage/expenseAlertDefault';

// Settings > general card: default notice (days) proposed for new expenses and used by those without
// their own `alertDays` (bell, upcoming deadlines, system notifications, .ics alarm).
export function ExpenseAlertDefaultRow() {
  const { t } = useI18n();
  const saved = useSyncExternalStore(subscribeExpenseAlertDefault, getExpenseAlertDefault, getExpenseAlertDefault);
  const [draft, setDraft] = useState(null);

  const onChange = (raw) => {
    setDraft(raw);
    const n = parseInt(raw, 10);
    if (Number.isFinite(n) && n >= 1) setExpenseAlertDefault(n);
  };

  return (
    <div className="settings-row">
      <div className="settings-row-info">
        <label className="settings-row-label" htmlFor="settings-expense-alert-days">
          {t('common.settings.expenseAlertDaysLabel')}
        </label>
        <span className="settings-row-desc">{t('common.settings.expenseAlertDaysDesc')}</span>
      </div>
      <input
        id="settings-expense-alert-days" type="number" className="form-input settings-days-input"
        min="1" max={MAX_ALERT_DAYS} value={draft ?? saved}
        onChange={(e) => onChange(e.target.value)} onBlur={() => setDraft(null)}
      />
    </div>
  );
}
