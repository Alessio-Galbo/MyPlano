import React, { useState } from 'react';
import { Modal, Button, useToast } from '../../components/ui';
import { useI18n } from '../../core/i18n';
import { DocumentFormFields } from './DocumentFormFields';
import { useFormProfileReset, hasProfile } from '../../core/profiles';
import '../profiles/AddProfileModal.css';

const DEFAULT_DOC = {
  title: '',
  type: 'idCard',
  profileId: '',
  identifier: '',
  issuer: '',
  issueDate: '',
  expiryDate: '',
  enableAlert: true,
  alertDays: 30,
  notes: '',
};

export function DocumentFormModal({ isOpen, onClose, onSave, editingDoc, profiles = [], documents = [] }) {
  const { t } = useI18n();
  const toast = useToast();
  const [formData, setFormData] = useState(DEFAULT_DOC);

  useFormProfileReset({
    isOpen, editingItem: editingDoc, profiles, setFormData,
    makeNew: (profileId) => ({ ...DEFAULT_DOC, profileId }),
    makeEdit: (doc) => ({ ...DEFAULT_DOC, ...doc }),
  });
  const canSave = hasProfile(profiles, formData.profileId);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!canSave) return;
    onSave(formData);
    toast.show({ message: t('common.toast.documentSaved'), variant: 'success' });
    onClose();
  };

  const titleKey = editingDoc ? 'documents.editDocument' : 'documents.addDocument';

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={t(titleKey)}>
      <form onSubmit={handleSubmit}>
        <DocumentFormFields
          formData={formData}
          setFormData={setFormData}
          profiles={profiles}
          documents={documents}
        />
        <div className="form-actions">
          <Button variant="secondary" onClick={onClose}>
            {t('common.actions.cancel')}
          </Button>
          <Button type="submit" variant="primary" disabled={profiles.length === 0}>
            {t('common.actions.save')}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
