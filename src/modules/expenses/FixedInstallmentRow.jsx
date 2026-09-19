import React from 'react';
import { Trash2 } from 'lucide-react';
import { Badge } from '../../components/ui';
import { useI18n } from '../../core/i18n';
import { formatCurrency } from './expenseHelpers';
import { formatDate } from '../documents/documentHelpers';
import { ReceiptAttachmentButton } from './ReceiptAttachmentButton';

export function FixedInstallmentRow({
  expense,
  details,
  onToggleStatus,
  onSaveReceipt,
  onRemoveReceipt,
  onDeleteExtra,
}) {
  const { t } = useI18n();
  const isPaid = details.status === 'paid';

  return (
    <tr className={details.isExtra ? 'row-extra-payment' : ''}>
      <td>
        <div className="installment-date-cell">
          <strong>{formatDate(details.date)}</strong>
          {details.isExtra && (
            <span className="extra-tag-pill">{t('expenses.history.extraTag')}</span>
          )}
        </div>
      </td>
      <td>{formatCurrency(details.amount)}</td>
      <td>
        <button
          type="button"
          className="btn-status-toggle"
          onClick={() => onToggleStatus(details.date)}
          title={isPaid ? t('expenses.installments.markUnpaid') : t('expenses.installments.markPaid')}
        >
          <Badge variant={isPaid ? 'success' : 'neutral'}>
            {isPaid ? (details.paidAt ? t('expenses.history.paidOn').replace('{date}', formatDate(details.paidAt)) : t('expenses.installments.paid')) : t('expenses.history.due')}
          </Badge>
        </button>
      </td>
      <td>
        <ReceiptAttachmentButton
          receipt={details.receipt}
          expense={expense}
          dueDate={details.date}
          onSaveReceipt={(rec) => onSaveReceipt(details.date, rec)}
          onRemoveReceipt={() => onRemoveReceipt(details.date)}
        />
      </td>
      <td>
        <div className="installment-notes-cell">
          <span className="text-subtle">{details.note || '-'}</span>
          {details.isExtra && onDeleteExtra && (
            <button
              type="button"
              className="btn-delete-extra"
              onClick={() => onDeleteExtra(details.date)}
              title={t('common.actions.delete')}
            >
              <Trash2 size={13} />
            </button>
          )}
        </div>
      </td>
    </tr>
  );
}
