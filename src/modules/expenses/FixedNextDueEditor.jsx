import React, { useState } from 'react';
import { Edit2, Check, X } from 'lucide-react';
import { useI18n } from '../../core/i18n';
import { formatDate } from '../documents/documentHelpers';
import './FixedNextDueEditor.css';

export function FixedNextDueEditor({ nextDueDate, onSaveDate }) {
  const { t } = useI18n();
  const [isEditing, setIsEditing] = useState(false);
  const [tempDate, setTempDate] = useState(nextDueDate || '');

  const handleSave = () => {
    if (tempDate) {
      onSaveDate(tempDate);
      setIsEditing(false);
    }
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
          <Check size={14} />
        </button>
        <button type="button" className="btn-icon-action cancel" onClick={() => setIsEditing(false)} title={t('common.actions.cancel')}>
          <X size={14} />
        </button>
      </div>
    );
  }

  return (
    <div className="fixed-next-due-display">
      <span className="fixed-history-next-val">{formatDate(nextDueDate)}</span>
      <button
        type="button"
        className="fixed-next-due-edit-btn"
        onClick={() => { setTempDate(nextDueDate); setIsEditing(true); }}
        title={t('expenses.history.editNextDue')}
      >
        <Edit2 size={12} />
      </button>
    </div>
  );
}
