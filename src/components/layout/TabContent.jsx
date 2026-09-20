import React from 'react';
import { BudgetTab } from '../../modules/budget';
import { DocumentList } from '../../modules/documents';
import { ExpenseList } from '../../modules/expenses';
import { SettingsView } from '../../modules/settings';

export function TabContent(props) {
  const {
    activeTab, selectedProfileId, onSelectProfile, expenses, documents, profiles,
    saveDocument, deleteDocument, saveExpense, deleteExpense, reloadAll,
  } = props;

  const onUpdateProfileBalance = props.onUpdateProfileBalance || props.updateProfileBalance;
  const onUpdateProfileIncome = props.onUpdateProfileIncome || props.updateProfileIncome;
  const onDepositProfileQuota = props.onDepositProfileQuota || props.depositQuotaToProfile;

  switch (activeTab) {
    case 'budget':
      return (
        <BudgetTab
          expenses={expenses}
          documents={documents}
          profiles={profiles}
          selectedProfileId={selectedProfileId}
          onSelectProfile={onSelectProfile}
          onUpdateProfileBalance={onUpdateProfileBalance}
          onUpdateProfileIncome={onUpdateProfileIncome}
          onDepositProfileQuota={onDepositProfileQuota}
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
          onUpdateProfileBalance={onUpdateProfileBalance}
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
