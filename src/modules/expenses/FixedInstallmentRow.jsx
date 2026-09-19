import React from 'react';
import { Trash2 } from 'lucide-react';
import { useI18n } from '../../core/i18n';
import { formatCurrency } from './expenseHelpers';
import { InstallmentDateCell } from './InstallmentDateCell';
import { InstallmentStatusButton } from './InstallmentStatusButton';
import { InstallmentAttTrigger } from './InstallmentAttTrigger';
import './FixedInstallmentRow.css';

export function FixedInstallmentRow({
  details,
  isActive,
  onSelectInstallment,
  onToggleStatus,
  onSaveDate,
  onRequestDeleteExtra,
}) {
  const { t } = useI18n();
  const attCount = details.attachments?.length || 0;

  return (
    <tr
      className={`${details.isExtra ? 'row-extra-payment' : ''} ${isActive ? 'active-installment-row' : ''}`}
      onClick={() => onSelectInstallment(details.date)}
    >
      <td>
        <div className="installment-date-col-wrapper">
          <InstallmentDateCell
            dateStr={details.date}
            isExtra={details.isExtra}
            onSaveDate={onSaveDate}
          />
          {details.isExtra && onRequestDeleteExtra && (
            <button
              type="button"
              className="btn-delete-extra"
              onClick={(e) => {
                e.stopPropagation();
                onRequestDeleteExtra(details.date);
              }}
              title={t('common.actions.delete')}
            >
              <Trash2 size={13} />
            </button>
          )}
        </div>
      </td>
      <td>
        <span className={details.isExtra ? 'extra-amount-text' : ''}>
          {formatCurrency(details.amount)}
        </span>
      </td>
      <td>
        <InstallmentStatusButton
          details={details}
          onToggleStatus={onToggleStatus}
          t={t}
        />
      </td>
      <td>
        <InstallmentAttTrigger
          attCount={attCount}
          isActive={isActive}
          date={details.date}
          onSelectInstallment={onSelectInstallment}
          t={t}
        />
      </td>
    </tr>
  );
}
