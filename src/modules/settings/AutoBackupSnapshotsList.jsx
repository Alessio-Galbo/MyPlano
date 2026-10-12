// Renders the list of saved automatic snapshots.
import React from 'react';
import { SnapshotItemRow } from './SnapshotItemRow';

export function AutoBackupSnapshotsList({ snapshots, snapshotMeta, onRestore, onDownload, onDelete, disabled }) {
  if (!snapshots || snapshots.length === 0) return null;

  return (
    <div className="snapshots-list" data-testid="snapshots-list">
      {snapshots.map((item) => (
        <SnapshotItemRow
          key={item.key || item.id}
          snapshot={item}
          meta={snapshotMeta(item)}
          onRestore={onRestore}
          onDownload={onDownload}
          onDelete={onDelete}
          disabled={disabled}
        />
      ))}
    </div>
  );
}
