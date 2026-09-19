import React from 'react';
import { FixedInstallmentRow } from './FixedInstallmentRow';

export function FixedInstallmentsTable({
  dates,
  activeDate,
  getDetails,
  onSelectInstallmentDate,
  onToggleStatus,
  onSaveDate,
  onRequestDeleteExtra,
  t,
}) {
  return (
    <div className="payments-table-wrapper">
      <table className="fixed-table">
        <thead>
          <tr>
            <th>{t('expenses.history.date')}</th>
            <th>{t('expenses.history.amount')}</th>
            <th>{t('expenses.history.status')}</th>
            <th>{t('expenses.history.attachments')}</th>
          </tr>
        </thead>
        <tbody>
          {dates.map((d) => (
            <FixedInstallmentRow
              key={d}
              details={getDetails(d)}
              isActive={d === activeDate}
              onSelectInstallment={onSelectInstallmentDate}
              onToggleStatus={onToggleStatus}
              onSaveDate={onSaveDate}
              onRequestDeleteExtra={onRequestDeleteExtra}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}
