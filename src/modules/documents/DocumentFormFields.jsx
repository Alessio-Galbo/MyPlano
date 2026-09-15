import React from 'react';
import { DOCUMENT_TYPES } from '../../core/types/constants';
import { useI18n } from '../../core/i18n';
import { DocumentValiditySelector } from './DocumentValiditySelector';
import { DocumentDetailsFields } from './DocumentDetailsFields';
import { DocumentAlertFields } from './DocumentAlertFields';

import { SuggestInput } from '../../components/ui';
import { getDocumentTypeLabel } from './documentHelpers';

export function DocumentFormFields({ formData, setFormData, profiles, documents = [] }) {
  const { t } = useI18n();

  const allTypes = Array.from(
    new Set([...DOCUMENT_TYPES, ...documents.map((d) => d.type).filter(Boolean)])
  );
  const typeOptions = allTypes.map((type) => ({
    value: type,
    label: getDocumentTypeLabel(type, t),
    count: documents.filter((d) => d.type === type).length,
  }));

  return (
    <>
      <div className="form-group">
        <label className="form-label">{t('documents.fields.title')}</label>
        <input
          type="text"
          className="form-input"
          required
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
        />
      </div>

      <div className="form-group">
        <label className="form-label">{t('documents.fields.type')}</label>
        <SuggestInput
          value={formData.type}
          onChange={(val) => setFormData({ ...formData, type: val })}
          options={typeOptions}
          placeholder={t('documents.fields.type')}
          required
        />
      </div>

      <div className="form-group">
        <label className="form-label">{t('documents.fields.owner')}</label>
        <select
          className="form-input"
          value={formData.profileId}
          onChange={(e) => setFormData({ ...formData, profileId: e.target.value })}
        >
          {profiles.map((p) => (
            <option key={p.id} value={p.id}>{p.name}</option>
          ))}
        </select>
      </div>

      <DocumentDetailsFields formData={formData} setFormData={setFormData} />

      <div className="form-group">
        <label className="form-label">{t('documents.fields.expiryDate')}</label>
        <input
          type="date"
          className="form-input"
          required
          value={formData.expiryDate}
          onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
        />
        <DocumentValiditySelector
          onSelectDuration={(newDate) => setFormData({ ...formData, expiryDate: newDate })}
        />
      </div>

      <DocumentAlertFields formData={formData} setFormData={setFormData} />
    </>
  );
}
