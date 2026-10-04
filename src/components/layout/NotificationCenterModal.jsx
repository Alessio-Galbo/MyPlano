import React from 'react';
import { RotateCcw } from 'lucide-react';
import { Modal, Button } from '../ui';
import { useI18n } from '../../core/i18n';
import { usePersistentState } from '../../hooks/usePersistentState';
import { UpcomingGroupedList } from '../../modules/budget/UpcomingGroupedList';
import { NotificationCenterItem } from './NotificationCenterItem';
import { NotificationCenterTabs } from './NotificationCenterTabs';
import './NotificationCenterModal.css';

const TABS = ['all', 'expenses', 'documents'];

export function NotificationCenterModal({
  isOpen,
  onClose,
  items = [],
  profiles = [],
  isDismissed = () => false,
  dismissedCount = 0,
  onToggleVisibility,
  onRestoreAll,
  onViewDetails,
}) {
  const { t } = useI18n();
  const [activeTab, setActiveTab] = usePersistentState(
    'notificationCenterTab', 'all', (v) => TABS.includes(v),
  );

  if (!isOpen) return null;

  const filtered = items.filter((item) => {
    if (activeTab === 'expenses') return item.itemType === 'expense';
    if (activeTab === 'documents') return item.itemType === 'document';
    return true;
  });

  const activeCountText = t('common.notifications.activeCount').replace('{count}', items.length - dismissedCount);
  const dismissedCountText = t('common.notifications.dismissedCount').replace('{count}', dismissedCount);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={t('common.notifications.centerTitle')}
      subtitle={t('common.notifications.centerSubtitle')}
      className="notif-center-modal"
    >
      <div className="notif-center-body">
        <div className="notif-center-status-bar">
          <span>{activeCountText} • {dismissedCountText}</span>
          {dismissedCount > 0 && (
            <button type="button" className="notif-restore-btn" onClick={onRestoreAll}>
              <RotateCcw size={12} /> {t('common.notifications.restoreAll')}
            </button>
          )}
        </div>

        <NotificationCenterTabs
          activeTab={activeTab}
          onSelectTab={setActiveTab}
          totalCount={items.length}
        />

        <div className="notif-center-list">
          {filtered.length === 0 ? (
            <div className="nav-notif-empty">{t('common.notifications.empty')}</div>
          ) : (
            <UpcomingGroupedList
              items={filtered}
              renderItem={(item) => (
                <NotificationCenterItem
                  key={item.id}
                  item={item}
                  profiles={profiles}
                  isHidden={isDismissed(item)}
                  onViewDetails={onViewDetails}
                  onToggleVisibility={onToggleVisibility}
                />
              )}
            />
          )}
        </div>

        <div className="upcoming-detail-actions">
          <Button type="button" variant="secondary" onClick={onClose}>
            {t('common.actions.close')}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
