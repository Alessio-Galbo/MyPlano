import React from 'react';
import { Paperclip } from 'lucide-react';

export function InstallmentAttTrigger({
  attCount = 0,
  isActive = false,
  date,
  onSelectInstallment,
  t,
}) {
  const attTitle = attCount > 0
    ? (attCount === 1
        ? t('expenses.history.attOne')
        : t('expenses.history.attMany').replace('{count}', attCount))
    : t('expenses.databaseHub.uploadReceipt');

  return (
    <button
      type="button"
      className={`installment-att-trigger ${attCount > 0 ? 'has-files' : 'empty'} ${isActive ? 'active' : ''}`}
      onClick={(e) => {
        e.stopPropagation();
        onSelectInstallment(date);
      }}
      title={attTitle}
      aria-label={attTitle}
    >
      <Paperclip size={13} />
      <span>{attCount}</span>
    </button>
  );
}
