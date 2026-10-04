import React from 'react';
import { Edit2, Trash2, CalendarClock } from 'lucide-react';
import { useI18n } from '../../core/i18n';
import './DocumentCardActions.css';

// Card buttons: "Renew" keeps a visible label; icon-only buttons get an aria-label
// (title alone is invisible on touch screens). Touch sizes: DocumentCardActions.css.
export function DocumentCardActions({ title, onRenew, onEdit, onDelete }) {
  const { t } = useI18n();
  const named = (action) => `${action}: ${title || ''}`.trim();
  return (
    <div className="doc-actions">
      <button
        type="button"
        className="btn btn-ghost btn-sm doc-action-btn doc-renew-btn"
        title={t('documents.quickRenew')}
        aria-label={named(t('documents.quickRenew'))}
        onClick={onRenew}
      >
        <CalendarClock size={15} aria-hidden="true" />
        <span>{t('common.actions.renew')}</span>
      </button>
      <button
        type="button"
        className="btn btn-ghost btn-sm doc-action-btn"
        title={t('common.actions.edit')}
        aria-label={named(t('common.actions.edit'))}
        onClick={onEdit}
      >
        <Edit2 size={15} aria-hidden="true" />
      </button>
      <button
        type="button"
        className="btn btn-ghost btn-sm doc-action-btn"
        title={t('common.actions.delete')}
        aria-label={named(t('common.actions.delete'))}
        onClick={onDelete}
      >
        <Trash2 size={15} aria-hidden="true" />
      </button>
    </div>
  );
}
