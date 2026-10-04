import React, { Suspense } from 'react';
import { BudgetTab } from '../../modules/budget';
import { DocumentList, ExpenseList, SettingsView } from './lazyTabs';
import { TabLoading } from './TabLoading';

// Budget stays eager (default first tab); the others are lazy chunks.
export function TabContent(props) {
  return (
    <Suspense fallback={<TabLoading />}>
      <TabSwitch {...props} />
    </Suspense>
  );
}

function TabSwitch(props) {
  const {
    activeTab, selectedProfileId, onSelectProfile, expenses, documents, profiles,
    saveDocument, deleteDocument, saveExpense, deleteExpense, reloadAll,
  } = props;

  const onUpdateProfileBalance = props.onUpdateProfileBalance || props.updateProfileBalance;
  const onUpdateProfileIncome = props.onUpdateProfileIncome || props.updateProfileIncome;
  const onDepositProfileQuota = props.onDepositProfileQuota || props.depositQuotaToProfile;
  const onAdjustProfileBalance = props.onAdjustProfileBalance || props.adjustProfileBalance;

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
          onAdjustProfileBalance={onAdjustProfileBalance}
        />
      );
    case 'settings':
      return (
        <SettingsView
          documents={documents}
          expenses={expenses}
          onSaveExpense={saveExpense}
          onDataRestored={reloadAll}
        />
      );
    default:
      return null;
  }
}
