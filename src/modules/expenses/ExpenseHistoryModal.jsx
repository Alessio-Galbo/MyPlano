import React, { useState } from 'react';
import { RefreshCw } from 'lucide-react';
import { Modal, Button } from '../../components/ui';
import { useI18n } from '../../core/i18n';
import { formatCurrency } from './expenseHelpers';
import { formatDate } from '../documents/documentHelpers';
import { calculateActiveContractAverage, getActiveContractPayments } from './variableExpenseHelpers';
import { AddBillPaymentForm } from './AddBillPaymentForm';
import { NewContractForm } from './NewContractForm';
import { BillPaymentsTable } from './BillPaymentsTable';
import './ExpenseHistoryModal.css';

export function ExpenseHistoryModal({ isOpen, onClose, expense, onUpdateExpense }) {
  const { t } = useI18n();
  const [isChangingContract, setIsChangingContract] = useState(false);

  if (!expense) return null;

  const activeAvg = calculateActiveContractAverage(expense);
  const activePayments = getActiveContractPayments(expense);
  const allPayments = expense.paymentHistory || [];

  const handleAddPayment = (newPayment) => {
    const updated = {
      ...expense,
      paymentHistory: [newPayment, ...allPayments],
    };
    onUpdateExpense(updated);
  };

  const handleDeletePayment = (paymentId) => {
    const updated = {
      ...expense,
      paymentHistory: allPayments.filter((p) => p.id !== paymentId),
    };
    onUpdateExpense(updated);
  };

  const handleSaveContract = (newContract) => {
    const updated = {
      ...expense,
      contract: newContract,
      amount: newContract.estimatedAmount,
    };
    onUpdateExpense(updated);
    setIsChangingContract(false);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`${expense.title} - ${t('expenses.variable.historyTitle')}`}>
      <div className="expense-history-modal-body">
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
      </div>
    </Modal>
  );
}
