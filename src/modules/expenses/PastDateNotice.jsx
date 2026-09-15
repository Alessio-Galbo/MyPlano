import React, { useState } from 'react';
import { AlertCircle, CheckCircle2, ArrowRight } from 'lucide-react';
import { useI18n } from '../../core/i18n';
import { calculateNextFutureOccurrence } from './pastDateHelpers';
import { formatDate } from '../documents/documentHelpers';
import './PastDateNotice.css';

export function PastDateNotice({ pastDate, frequency, onApplyDate }) {
  const { t } = useI18n();
  const [wasPaid, setWasPaid] = useState(false);

  const projectedDate = calculateNextFutureOccurrence(pastDate, frequency);

  return (
    <div className="past-date-notice">
      <div className="past-date-header">
        <AlertCircle size={16} className="text-warning" />
        <span className="past-date-warning">{t('expenses.pastDate.isPastWarning')}</span>
      </div>

      <label className="past-date-checkbox-label">
        <input
          type="checkbox"
          checked={wasPaid}
          onChange={(e) => setWasPaid(e.target.checked)}
          className="form-checkbox"
        />
        <span>{t('expenses.pastDate.alreadyPaidLabel')}</span>
      </label>

      {wasPaid ? (
        <div className="past-date-projected-box">
          <p className="past-date-hint">{t('expenses.pastDate.alreadyPaidHint')}</p>
          <div className="past-date-action-row">
            <span className="past-date-projected-text">
              {t('expenses.pastDate.projectedNextDate')} <strong>{formatDate(projectedDate)}</strong>
            </span>
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={() => onApplyDate(projectedDate)}
            >
              <CheckCircle2 size={14} />
              <span>{t('expenses.pastDate.applyProjected')}</span>
            </button>
          </div>
        </div>
      ) : (
        <p className="past-date-unpaid-text">{t('expenses.pastDate.unpaidWarning')}</p>
      )}
    </div>
  );
}
