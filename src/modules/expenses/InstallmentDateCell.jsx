import React, { useState } from 'react';
import { Edit2, Check, X } from 'lucide-react';
import { useI18n } from '../../core/i18n';
import { formatDate } from '../documents/documentHelpers';

export function InstallmentDateCell({ dateStr, isExtra, onSaveDate }) {
  const { t } = useI18n();
  const [isEditing, setIsEditing] = useState(false);
  const [tempDate, setTempDate] = useState(dateStr || '');

  const handleSave = () => {
    if (tempDate && tempDate !== dateStr) {
      onSaveDate(dateStr, tempDate);
    }
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <div className="fixed-next-due-edit-row">
        <input
          type="date"
          className="form-input fixed-date-input"
          value={tempDate}
          onChange={(e) => setTempDate(e.target.value)}
        />
        <button type="button" className="btn-icon-action save" onClick={handleSave} title={t('common.actions.save')}>
          <Check size={13} />
        </button>
        <button type="button" className="btn-icon-action cancel" onClick={() => setIsEditing(false)} title={t('common.actions.cancel')}>
          <X size={13} />
        </button>
      </div>
    );
  }

  return (
    <div className="installment-date-cell">
      <strong>{formatDate(dateStr)}</strong>
      {isExtra && <span className="extra-tag-pill">{t('expenses.history.extraTag')}</span>}
      <button
        type="button"
        className="installment-date-edit-btn"
        onClick={() => { setTempDate(dateStr); setIsEditing(true); }}
        title={t('expenses.history.editDate')}
      >
        <Edit2 size={11} />
      </button>
    </div>
  );
}
