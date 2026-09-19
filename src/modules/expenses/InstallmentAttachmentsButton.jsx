import React from 'react';
import { Paperclip } from 'lucide-react';
import { useI18n } from '../../core/i18n';

export function InstallmentAttachmentsButton({ attachments = [], onOpenModal }) {
  const { t } = useI18n();
  const count = attachments.length;

  if (count > 0) {
    const label = count === 1
      ? t('expenses.history.attOne')
      : t('expenses.history.attMany').replace('{count}', count);

    return (
      <button
        type="button"
        className="installment-att-btn has-files"
        onClick={onOpenModal}
        title={t('expenses.history.manageAttachments')}
      >
        <Paperclip size={12} />
        <span>{label}</span>
      </button>
    );
  }

  return (
    <button
      type="button"
      className="installment-att-btn empty"
      onClick={onOpenModal}
      title={t('expenses.history.attachReceipt')}
    >
      <Paperclip size={12} />
      <span>+ {t('expenses.history.attach')}</span>
    </button>
  );
}
