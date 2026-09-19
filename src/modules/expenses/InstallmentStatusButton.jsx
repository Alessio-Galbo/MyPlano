import React from 'react';
import { CheckCircle2, Clock } from 'lucide-react';
import { formatDate } from '../documents/documentHelpers';

export function InstallmentStatusButton({ details, onToggleStatus, t }) {
  const isPaid = details.status === 'paid';

  const statusTitle = isPaid
    ? (details.paidAt
        ? t('expenses.history.paidOn').replace('{date}', formatDate(details.paidAt))
        : t('expenses.installments.paid'))
    : t('expenses.history.due');

  return (
    <button
      type="button"
      className={`btn-status-icon ${isPaid ? 'paid' : 'due'}`}
      onClick={(e) => {
        e.stopPropagation();
        onToggleStatus(details.date);
      }}
      title={statusTitle}
      aria-label={statusTitle}
    >
      {isPaid ? (
        <CheckCircle2 size={17} className="status-icon-check" />
      ) : (
        <Clock size={17} className="status-icon-clock" />
      )}
    </button>
  );
}
