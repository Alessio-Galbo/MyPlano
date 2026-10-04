import React, { useState } from 'react';
import { createItemId } from '../../core/storage/idMigrationHelper';
import { DocumentListBody } from './DocumentListBody';
import { DocumentFormModal } from './DocumentFormModal';
import { DocumentRenewModal } from './DocumentRenewModal';
import { DocumentListHeader } from './DocumentListHeader';
import { useDocumentDeleteWithUndo } from './useDocumentDeleteWithUndo';
import { todayISO } from '../../core/dates/isoDate';
import './DocumentList.css';

export function DocumentList({
  documents,
  profiles,
  selectedProfileId,
  onSaveDocument,
  onDeleteDocument,
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDoc, setEditingDoc] = useState(null);
  const [renewingDoc, setRenewingDoc] = useState(null);
  const handleDelete = useDocumentDeleteWithUndo({ documents, onDeleteDocument, onSaveDocument });

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
      <DocumentListHeader onCreate={handleCreate} disabled={!profiles?.length} />

      <DocumentListBody
        documents={filtered} profiles={profiles} selectedProfileId={selectedProfileId} onCreate={handleCreate}
        onEdit={handleEdit} onDelete={handleDelete} onToggleAlert={handleToggleAlert}
        onQuickRenew={(d) => setRenewingDoc(d)}
      />

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
            id: createItemId('ren'),
            renewedAt: todayISO(),
            previousExpiryDate: doc.expiryDate,
            newExpiryDate: date,
          };
          onSaveDocument({ ...doc, expiryDate: date, renewalHistory: [...(doc.renewalHistory || []), rec] });
        }}
      />
    </div>
  );
}
