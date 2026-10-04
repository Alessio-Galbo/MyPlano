import React, { useState, useEffect } from 'react';
import { Modal, Button, useToast } from '../../components/ui';
import { useI18n } from '../../core/i18n';
import { DocumentFormFields } from './DocumentFormFields';
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

export function DocumentFormModal({ isOpen, onClose, onSave, editingDoc, profiles, documents = [] }) {
  const { t } = useI18n();
  const toast = useToast();
  const [formData, setFormData] = useState(DEFAULT_DOC);

  useEffect(() => {
    if (editingDoc) {
      setFormData({
        ...DEFAULT_DOC,
        ...editingDoc,
      });
    } else {
      setFormData({
        ...DEFAULT_DOC,
        profileId: profiles[0]?.id || '',
      });
    }
  }, [editingDoc, profiles, isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
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
          <Button type="submit" variant="primary">
            {t('common.actions.save')}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
