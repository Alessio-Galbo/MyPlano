import React, { useMemo, useState } from 'react';
import { UserCheck, Users } from 'lucide-react';
import { Button, ConfirmModal, useToast } from '../../components/ui';
import { useI18n } from '../../core/i18n';
import { findOrphanItems, orphanKey, assignOrphanItems, NoProfileNotice } from '../../core/profiles';
import { ORPHAN_ITEMS_ANCHOR } from './OrphanItemsAnchor';
import { OrphanItemsRow } from './OrphanItemsRow';
import './OrphanItemsCard.css';

// Lists expenses/documents whose profile is missing. Nothing changes until the user picks a
// profile (per item or for all) and confirms; then only those items are saved.
export function OrphanItemsCard({ expenses, documents, profiles = [], onSaveExpense, onSaveDocument }) {
  const { t } = useI18n();
  const toast = useToast();
  const orphans = useMemo(() => findOrphanItems(expenses, documents, profiles), [expenses, documents, profiles]);
  const [choices, setChoices] = useState({});
  const [confirmOpen, setConfirmOpen] = useState(false);

  if (orphans.length === 0) return null;

  const toId = (raw) => profiles.find((p) => String(p.id) === raw)?.id ?? '';
  const setOne = (key, raw) => setChoices((prev) => ({ ...prev, [key]: toId(raw) }));
  const setAll = (raw) => {
    if (!raw) return;
    setChoices(Object.fromEntries(orphans.map((o) => [orphanKey(o), toId(raw)])));
  };
  const toSave = assignOrphanItems(orphans, choices, profiles);
  const n = toSave.length;
  const plural = (many, one) => t(n === 1 ? one : many, { n });

  const handleApply = () => {
    toSave.forEach(({ kind, item }) => (kind === 'expense' ? onSaveExpense : onSaveDocument)?.(item));
    setChoices({});
    toast.show({ message: t('common.orphans.done'), variant: 'success' });
  };

  return (
    <div className="settings-card oic-card" id={ORPHAN_ITEMS_ANCHOR} data-testid="orphan-card">
      <div className="settings-card-header">
        <Users size={20} className="text-muted" />
        <h3 className="settings-card-title">{t('common.orphans.title')}</h3>
      </div>
      <p className="settings-guide-text">{t('common.orphans.desc')}</p>

      {profiles.length === 0 ? <NoProfileNotice /> : (
        <>
          <div className="oic-all">
            <span className="oic-all-label">{t('common.orphans.assignAll')}</span>
            <select className="form-input oic-select" value="" onChange={(e) => setAll(e.target.value)}
              data-testid="orphan-assign-all">
              <option value="">{t('common.profileField.choose')}</option>
              {profiles.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
          </div>
          <ul className="oic-list">
            {orphans.map((o) => (
              <OrphanItemsRow key={orphanKey(o)} orphan={o} profiles={profiles}
                value={choices[orphanKey(o)]} onChange={(raw) => setOne(orphanKey(o), raw)} />
            ))}
          </ul>
          <div className="oic-actions">
            <Button variant="primary" size="sm" icon={<UserCheck size={14} />} disabled={n === 0}
              onClick={() => setConfirmOpen(true)} data-testid="orphan-apply">
              {plural('common.orphans.apply', 'common.orphans.applyOne')}
            </Button>
          </div>
        </>
      )}

      <ConfirmModal
        isOpen={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={handleApply}
        title={t('common.orphans.confirmTitle')}
        message={plural('common.orphans.confirmMessage', 'common.orphans.confirmMessageOne')}
        confirmText={t('common.orphans.confirmButton')}
        variant="primary"
      />
    </div>
  );
}
