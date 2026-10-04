import React from 'react';
import { Trash2 } from 'lucide-react';
import { Badge } from '../../components/ui';
import { useI18n } from '../../core/i18n';
import { formatCurrency } from './expenseHelpers';
import { formatDate } from '../documents/documentHelpers';
import './BillPaymentsTable.css';

export function BillPaymentsTable({ allPayments, activePayments, onDeletePayment, noBillsText }) {
  const { t } = useI18n();
  if (allPayments.length === 0) {
    return <p className="text-subtle">{noBillsText}</p>;
  }

  return (
    <div className="payments-table-wrapper">
      <table className="payments-table bill-payments-table">
        <thead>
          <tr>
            <th>{t('expenses.variable.billDate')}</th>
            <th>{t('expenses.history.amount')}</th>
            <th>{t('expenses.variable.contractColumn')}</th>
            <th>{t('expenses.variable.billNote')}</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {allPayments.map((p) => {
            const isActive = activePayments.some((ap) => ap.id === p.id);
            return (
              <tr key={p.id} className={isActive ? 'payment-row-active' : 'payment-row-past'}>
                <td>{formatDate(p.date)}</td>
                <td><strong>{formatCurrency(p.amount)}</strong></td>
                <td>
                  <Badge variant={isActive ? 'success' : 'neutral'}>
                    {isActive ? t('expenses.variable.contractActive') : t('expenses.variable.contractPrevious')}
                  </Badge>
                </td>
                <td className="text-subtle">{p.note || '-'}</td>
                <td>
                  <button
                    type="button"
                    className="btn btn-ghost btn-sm"
                    onClick={() => onDeletePayment(p.id)}
                  >
                    <Trash2 size={13} />
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
