import React, { useState } from 'react';
import { RefreshCw } from 'lucide-react';
import { Button } from '../../components/ui';
import { useI18n } from '../../core/i18n';
import { formatCurrency } from './expenseHelpers';
import { formatDate } from '../documents/documentHelpers';
import { calculateActiveContractAverage, getActiveContractPayments } from './variableExpenseHelpers';
import { AddBillPaymentForm } from './AddBillPaymentForm';
import { NewContractForm } from './NewContractForm';
import { BillPaymentsTable } from './BillPaymentsTable';

export function VariableExpenseHistoryView({ expense, onUpdateExpense }) {
  const { t } = useI18n();
  const [isChangingContract, setIsChangingContract] = useState(false);

  const activeAvg = calculateActiveContractAverage(expense);
  const activePayments = getActiveContractPayments(expense);
  const allPayments = expense.paymentHistory || [];

  const handleAddPayment = (newPayment) => {
    onUpdateExpense({ ...expense, paymentHistory: [newPayment, ...allPayments] });
  };

  const handleDeletePayment = (paymentId) => {
    onUpdateExpense({ ...expense, paymentHistory: allPayments.filter((p) => p.id !== paymentId) });
  };

  const handleSaveContract = (newContract) => {
    onUpdateExpense({ ...expense, contract: newContract, amount: newContract.estimatedAmount });
    setIsChangingContract(false);
  };

  return (
    <>
      <div className="contract-status-bar">
        <div>
          <div className="contract-name-title">
            {expense.contract?.name || t('expenses.variable.contractName')}
          </div>
          <div className="text-subtle">
            {t('expenses.variable.contractStartDate')}: {formatDate(expense.contract?.startDate)} |{' '}
            {t('expenses.variable.activeAverage')}: <strong>{formatCurrency(activeAvg)}</strong> ({activePayments.length} bollette)
          </div>
        </div>
        <Button
          size="sm"
          variant="secondary"
          icon={<RefreshCw size={13} />}
          onClick={() => setIsChangingContract(!isChangingContract)}
        >
          {t('expenses.variable.newContractBtn')}
        </Button>
      </div>

      {isChangingContract && (
        <NewContractForm
          currentContract={expense.contract}
          onSaveContract={handleSaveContract}
          onCancel={() => setIsChangingContract(false)}
        />
      )}

      <AddBillPaymentForm onAddPayment={handleAddPayment} />

      <div className="payments-list-section">
        <h5 className="payments-list-title">Storico Bollette Registrate</h5>
        <BillPaymentsTable
          allPayments={allPayments}
          activePayments={activePayments}
          onDeletePayment={handleDeletePayment}
          noBillsText={t('expenses.variable.noBills')}
        />
      </div>
    </>
  );
}
