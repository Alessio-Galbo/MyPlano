import React from 'react';
import { BudgetTab } from '../../modules/budget';
import { DocumentList } from '../../modules/documents';
import { ExpenseList } from '../../modules/expenses';
import { SettingsView } from '../../modules/settings';

export function TabContent({
  activeTab,
  selectedProfileId,
  expenses,
  documents,
  profiles,
  initialBalance,
  onUpdateInitialBalance,
  monthlyIncome,
  onUpdateMonthlyIncome,
  profileFunds,
  profileFundConfigs,
  onUpdateProfileFund,
  onSetProfileUsesDedicatedFund,
  profileIncomes,
  profileIncomeConfigs,
  onUpdateProfileIncome,
  onSetProfileUsesDedicatedIncome,
  saveDocument,
  deleteDocument,
  saveExpense,
  deleteExpense,
  reloadAll,
}) {
  switch (activeTab) {
    case 'budget':
      return (
        <BudgetTab
          expenses={expenses}
          profiles={profiles}
          selectedProfileId={selectedProfileId}
          initialBalance={initialBalance}
          onUpdateInitialBalance={onUpdateInitialBalance}
          monthlyIncome={monthlyIncome}
          onUpdateMonthlyIncome={onUpdateMonthlyIncome}
          profileFunds={profileFunds}
          profileFundConfigs={profileFundConfigs}
          onUpdateProfileFund={onUpdateProfileFund}
          onSetProfileUsesDedicatedFund={onSetProfileUsesDedicatedFund}
          profileIncomes={profileIncomes}
          profileIncomeConfigs={profileIncomeConfigs}
          onUpdateProfileIncome={onUpdateProfileIncome}
          onSetProfileUsesDedicatedIncome={onSetProfileUsesDedicatedIncome}
        />
      );
    case 'documents':
      return (
        <DocumentList
          documents={documents}
          profiles={profiles}
          selectedProfileId={selectedProfileId}
          onSaveDocument={saveDocument}
          onDeleteDocument={deleteDocument}
        />
      );
    case 'expenses':
      return (
        <ExpenseList
          expenses={expenses}
          profiles={profiles}
          selectedProfileId={selectedProfileId}
          onSaveExpense={saveExpense}
          onDeleteExpense={deleteExpense}
        />
      );
    case 'settings':
      return (
        <SettingsView
          documents={documents}
          expenses={expenses}
          onDataRestored={reloadAll}
        />
      );
    default:
      return null;
  }
}
