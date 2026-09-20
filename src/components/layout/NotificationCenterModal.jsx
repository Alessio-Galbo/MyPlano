import React, { useState } from 'react';
import { RotateCcw } from 'lucide-react';
import { Modal, Button } from '../ui';
import { useI18n } from '../../core/i18n';
import { NotificationCenterItem } from './NotificationCenterItem';
import { NotificationCenterTabs } from './NotificationCenterTabs';
import './NotificationCenterModal.css';

export function NotificationCenterModal({
  isOpen,
  onClose,
  items = [],
  profiles = [],
  dismissedIds = [],
  onToggleVisibility,
  onRestoreAll,
  onViewDetails,
}) {
  const { t } = useI18n();
  const [activeTab, setActiveTab] = useState('all');

  if (!isOpen) return null;

  const filtered = items.filter((item) => {
    if (activeTab === 'expenses') return item.itemType === 'expense';
    if (activeTab === 'documents') return item.itemType === 'document';
    return true;
  });

  const activeCount = items.filter((it) => !dismissedIds.includes(it.id)).length;
  const activeCountText = t('common.notifications.activeCount').replace('{count}', activeCount);
  const dismissedCountText = t('common.notifications.dismissedCount').replace('{count}', dismissedIds.length);

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
          {dismissedIds.length > 0 && (
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
            filtered.map((item) => (
              <NotificationCenterItem
                key={item.id}
                item={item}
                profiles={profiles}
                isHidden={dismissedIds.includes(item.id)}
                onViewDetails={onViewDetails}
                onToggleVisibility={onToggleVisibility}
              />
            ))
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
