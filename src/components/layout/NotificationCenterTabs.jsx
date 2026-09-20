import React from 'react';
import { useI18n } from '../../core/i18n';

export function NotificationCenterTabs({ activeTab, onSelectTab, totalCount }) {
  const { t } = useI18n();

  return (
    <div className="notif-center-tabs">
      <button
        type="button"
        className={`notif-center-tab ${activeTab === 'all' ? 'active' : ''}`}
        onClick={() => onSelectTab('all')}
      >
        {t('common.actions.all')} ({totalCount})
      </button>
      <button
        type="button"
        className={`notif-center-tab ${activeTab === 'expenses' ? 'active' : ''}`}
        onClick={() => onSelectTab('expenses')}
      >
        {t('common.nav.expenses')}
      </button>
      <button
        type="button"
        className={`notif-center-tab ${activeTab === 'documents' ? 'active' : ''}`}
        onClick={() => onSelectTab('documents')}
      >
        {t('common.nav.documents')}
      </button>
    </div>
  );
}
