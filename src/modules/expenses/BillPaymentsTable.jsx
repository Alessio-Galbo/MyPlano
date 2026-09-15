import React from 'react';
import { Trash2 } from 'lucide-react';
import { Badge } from '../../components/ui';
import { formatCurrency } from './expenseHelpers';
import { formatDate } from '../documents/documentHelpers';

export function BillPaymentsTable({ allPayments, activePayments, onDeletePayment, noBillsText }) {
  if (allPayments.length === 0) {
    return <p className="text-subtle">{noBillsText}</p>;
  }

  return (
    <div className="payments-table-wrapper">
      <table className="payments-table">
        <thead>
          <tr>
            <th>Data</th>
            <th>Importo</th>
            <th>Contratto</th>
            <th>Note</th>
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
                    {isActive ? 'Attivo' : 'Precedente'}
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
