import React from 'react';
import { Receipt, FileText } from 'lucide-react';
import { useI18n } from '../../core/i18n';

// One item without a valid profile, with the menu to choose where it should go.
export function OrphanItemsRow({ orphan, profiles, value, onChange }) {
  const { t } = useI18n();
  const isExp = orphan.kind === 'expense';
  return (
    <li className="oic-item" data-testid="orphan-item">
      <span className="oic-info">
        {isExp ? <Receipt size={16} aria-hidden="true" /> : <FileText size={16} aria-hidden="true" />}
        <span className="oic-title">{orphan.title || t('common.orphans.untitled')}</span>
        <span className="oic-kind">{t(isExp ? 'common.orphans.expense' : 'common.orphans.document')}</span>
      </span>
      <select
        className="form-input oic-select"
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        aria-label={t('common.orphans.chooseFor', { title: orphan.title })}
      >
        <option value="">{t('common.profileField.choose')}</option>
        {profiles.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
      </select>
    </li>
  );
}
