import React from 'react';
import { useI18n } from '../../core/i18n';

export function DocumentDetailsFields({ formData, setFormData }) {
  const { t } = useI18n();

  return (
    <>
      <div className="form-group">
        <label className="form-label">{t('documents.fields.identifier')}</label>
        <input
          type="text"
          className="form-input"
          placeholder="es. CA12345AA"
          value={formData.identifier || ''}
          onChange={(e) => setFormData({ ...formData, identifier: e.target.value })}
        />
      </div>

      <div className="form-group">
        <label className="form-label">{t('documents.fields.issuer')}</label>
        <input
          type="text"
          className="form-input"
          placeholder="es. Comune di Roma / MIT - UCO"
          value={formData.issuer || ''}
          onChange={(e) => setFormData({ ...formData, issuer: e.target.value })}
        />
      </div>

      <div className="form-group">
        <label className="form-label">{t('documents.fields.issueDate')}</label>
        <input
          type="date"
          className="form-input"
          value={formData.issueDate || ''}
          onChange={(e) => setFormData({ ...formData, issueDate: e.target.value })}
        />
      </div>
    </>
  );
}
