import React from 'react';
import { Toggle } from '../../components/ui';
import { useI18n } from '../../core/i18n';

export function DocumentAlertFields({ formData, setFormData }) {
  const { t } = useI18n();

  return (
    <>
      <div className="form-group">
        <label className="form-label">{t('documents.fields.alertDays')}</label>
        <input
          type="number"
          className="form-input"
          min="1"
          max="365"
          value={formData.alertDays || 30}
          onChange={(e) => setFormData({ ...formData, alertDays: parseInt(e.target.value, 10) || 30 })}
        />
      </div>

      <div className="form-group">
        <label className="form-label">{t('documents.fields.notes')}</label>
        <textarea
          className="form-input"
          rows="2"
          placeholder="es. Rinnovo da prenotare su CIE Online"
          value={formData.notes || ''}
          onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
        />
      </div>

      <div className="form-group">
        <Toggle
          checked={formData.enableAlert !== false}
          onChange={(checked) => setFormData({ ...formData, enableAlert: checked })}
          label={t('documents.fields.enableAlert')}
          id="doc-form-enable-alert"
        />
      </div>
    </>
  );
}
