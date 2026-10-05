import React from 'react';
import { Toggle } from '../../components/ui';
import { useI18n } from '../../core/i18n';
import { MAX_ALERT_DAYS } from '../../core/notifications/alertDays';
import { getExpenseAlertDefault } from '../../core/storage/expenseAlertDefault';
import './ExpenseAlertFields.css';

// "Enable alert" + "Notify me N days before" (`alertDays`). An expense without its own value shows the
// global default from Settings; the number is disabled while the alert is off.
export function ExpenseAlertFields({ formData, setFormData }) {
  const { t } = useI18n();
  const enabled = formData.enableAlert !== false;
  const value = formData.alertDays ?? getExpenseAlertDefault();

  const onDays = (raw) => {
    const n = parseInt(raw, 10);
    setFormData({ ...formData, alertDays: Number.isFinite(n) ? n : '' });
  };

  return (
    <div className="form-row">
      <div className="form-group expense-alert-toggle">
        <Toggle
          checked={enabled} id="exp-form-enable-alert" label={t('expenses.fields.enableAlert')}
          onChange={(checked) => setFormData({ ...formData, enableAlert: checked })}
        />
      </div>
      <div className="form-group">
        <label className="form-label" htmlFor="exp-form-alert-days">{t('expenses.fields.alertDays')}</label>
        <input
          id="exp-form-alert-days" type="number" className="form-input" min="1" max={MAX_ALERT_DAYS}
          value={value} disabled={!enabled} onChange={(e) => onDays(e.target.value)}
        />
      </div>
    </div>
  );
}
