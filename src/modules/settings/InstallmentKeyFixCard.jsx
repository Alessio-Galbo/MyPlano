import React, { useMemo, useState } from 'react';
import { CalendarCheck, Wrench } from 'lucide-react';
import { Button, ConfirmModal, useToast } from '../../components/ui';
import { useI18n } from '../../core/i18n';
import { findShiftedInstallmentKeys, applyInstallmentKeyFixes } from '../../core/dates/installmentKeyAudit';
import { formatDate } from '../documents/documentHelpers';
import { INSTALLMENT_FIX_ANCHOR } from '../budget/InstallmentFixBanner';
import './InstallmentKeyFixCard.css';

const fixKey = (f) => `${f.expenseId}|${f.fromKey}`;

// Shows installments saved one day early by the old timezone bug. Nothing changes until the
// user selects the entries and confirms: then only the selected keys are moved.
export function InstallmentKeyFixCard({ expenses, onSaveExpense }) {
  const { t } = useI18n();
  const toast = useToast();
  const fixes = useMemo(() => findShiftedInstallmentKeys(expenses), [expenses]);
  const [unchecked, setUnchecked] = useState(() => new Set());
  const [confirmOpen, setConfirmOpen] = useState(false);

  if (fixes.length === 0 || !onSaveExpense) return null;

  const selected = fixes.filter((f) => !unchecked.has(fixKey(f)));
  const toggle = (key) => setUnchecked((prev) => {
    const next = new Set(prev);
    if (next.has(key)) next.delete(key); else next.add(key);
    return next;
  });

  const handleApply = () => {
    const updated = applyInstallmentKeyFixes(expenses, selected);
    let count = 0;
    updated.forEach((exp, i) => {
      if (exp !== expenses[i]) { onSaveExpense(exp); count += 1; }
    });
    setUnchecked(new Set());
    if (count > 0) {
      toast.show({ message: t('common.installmentFix.done'), variant: 'success' });
    }
  };

  const countText = (many, one) => t(selected.length === 1 ? one : many, { n: selected.length });

  return (
    <div className="settings-card ikf-card" id={INSTALLMENT_FIX_ANCHOR}>
      <div className="settings-card-header">
        <Wrench size={20} className="text-muted" />
        <h3 className="settings-card-title">{t('common.installmentFix.title')}</h3>
      </div>
      <p className="settings-guide-text">{t('common.installmentFix.desc')}</p>

      <ul className="ikf-list">
        {fixes.map((f) => {
          const key = fixKey(f);
          return (
            <li key={key} className="ikf-item">
              <label className="ikf-label">
                <input
                  type="checkbox"
                  checked={!unchecked.has(key)}
                  onChange={() => toggle(key)}
                />
                <span className="ikf-title">{f.title || t('common.installmentFix.untitled')}</span>
              </label>
              <span className="ikf-dates">
                <span className="ikf-from">{formatDate(f.fromKey)}</span>
                <span aria-hidden="true">→</span>
                <span className="ikf-to">{formatDate(f.toKey)}</span>
              </span>
            </li>
          );
        })}
      </ul>

      <div className="ikf-actions">
        <Button
          variant="primary"
          size="sm"
          icon={<CalendarCheck size={14} />}
          disabled={selected.length === 0}
          onClick={() => setConfirmOpen(true)}
        >
          {countText('common.installmentFix.apply', 'common.installmentFix.applyOne')}
        </Button>
      </div>

      <ConfirmModal
        isOpen={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={handleApply}
        title={t('common.installmentFix.confirmTitle')}
        message={countText('common.installmentFix.confirmMessage', 'common.installmentFix.confirmMessageOne')}
        confirmText={t('common.installmentFix.confirmButton')}
        variant="primary"
      />
    </div>
  );
}
