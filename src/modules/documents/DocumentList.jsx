import React, { useState } from 'react';
import { useI18n } from '../../core/i18n';
import { DocumentCard } from './DocumentCard';
import { DocumentFormModal } from './DocumentFormModal';
import { DocumentRenewModal } from './DocumentRenewModal';
import { DocumentListHeader } from './DocumentListHeader';
import './DocumentList.css';

export function DocumentList({
  documents,
  profiles,
  selectedProfileId,
  onSaveDocument,
  onDeleteDocument,
}) {
  const { t } = useI18n();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDoc, setEditingDoc] = useState(null);
  const [renewingDoc, setRenewingDoc] = useState(null);

  const filtered = selectedProfileId === 'all'
    ? documents
    : documents.filter((d) => d.profileId === selectedProfileId);

  const handleEdit = (doc) => {
    setEditingDoc(doc);
    setIsModalOpen(true);
  };

  const handleCreate = () => {
    setEditingDoc(null);
    setIsModalOpen(true);
  };

  const handleToggleAlert = (id, enableAlert) => {
    const doc = documents.find((d) => d.id === id);
    if (doc) onSaveDocument({ ...doc, enableAlert });
  };

  return (
    <div className="doc-list-view">
      <DocumentListHeader onCreate={handleCreate} />

      {filtered.length === 0 ? (
        <div className="empty-state">{t('documents.emptyState')}</div>
      ) : (
        <div className="grid-cards">
          {filtered.map((doc) => (
            <DocumentCard
              key={doc.id}
              document={doc}
              profile={profiles.find((p) => p.id === doc.profileId)}
              onEdit={handleEdit}
              onDelete={onDeleteDocument}
              onToggleAlert={handleToggleAlert}
              onQuickRenew={(d) => setRenewingDoc(d)}
            />
          ))}
        </div>
      )}

      <DocumentFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={onSaveDocument}
        editingDoc={editingDoc}
        profiles={profiles}
        documents={documents}
      />

      <DocumentRenewModal
        isOpen={Boolean(renewingDoc)}
        onClose={() => setRenewingDoc(null)}
        document={renewingDoc}
        onConfirmRenew={(doc, date) => {
          const rec = {
            id: `ren-${Date.now()}`,
            renewedAt: new Date().toISOString().split('T')[0],
            previousExpiryDate: doc.expiryDate,
            newExpiryDate: date,
          };
          onSaveDocument({ ...doc, expiryDate: date, renewalHistory: [...(doc.renewalHistory || []), rec] });
        }}
      />
    </div>
  );
}
