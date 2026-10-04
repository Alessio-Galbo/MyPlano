import React from 'react';
import { DocumentCard } from './DocumentCard';
import { DocumentEmptyState } from './DocumentEmptyState';
import { FirstProfileGuide } from '../../components/onboarding';

// Cards of the documents tab, or the right guide when there is nothing to show.
export function DocumentListBody({ documents, profiles, selectedProfileId, onCreate, ...cardHandlers }) {
  if (!profiles?.length) return <FirstProfileGuide />;
  if (documents.length === 0) {
    return <DocumentEmptyState profiles={profiles} selectedProfileId={selectedProfileId} onCreate={onCreate} />;
  }
  return (
    <div className="grid-cards">
      {documents.map((doc) => (
        <DocumentCard
          key={doc.id}
          document={doc}
          profile={profiles.find((p) => p.id === doc.profileId)}
          {...cardHandlers}
        />
      ))}
    </div>
  );
}
