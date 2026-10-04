import React from 'react';
import { Receipt, FileText, X, SlidersHorizontal } from 'lucide-react';
import { useI18n } from '../../core/i18n';
import { ensureProfileClass } from '../../core/theme/dynamicThemeService';
import { formatDate } from '../../modules/documents/documentHelpers';
import { getUpcomingDaysLabel } from '../../modules/budget/upcomingDaysLabel';
import { UpcomingGroupedList } from '../../modules/budget/UpcomingGroupedList';
import '../../core/profiles/profileField.css';

export function NavbarNotificationsDropdown({
  items = [],
  profiles = [],
  isMuted = false,
  onItemClick,
  onDismiss,
  onOpenCenter,
}) {
  const { t } = useI18n();
  const count = items.length;

  const renderItem = (item) => {
    const isExp = item.itemType === 'expense';
    const profile = profiles.find((p) => p.id === item.profileId);
    const profileTheme = profile ? ensureProfileClass(profile.id) : '';
    return (
      <div key={item.id} className={`nav-notif-item ${item.isOverdue ? 'is-overdue' : ''}`} data-notif-id={item.id}>
        <button type="button" className="nav-notif-item-left nav-notif-item-main" onClick={() => onItemClick(item)}>
          <span className={`nav-notif-icon ${isExp ? 'expense' : 'document'}`}>
            {isExp ? <Receipt size={14} /> : <FileText size={14} />}
          </span>
          <span className="nav-notif-text">
            <span className="nav-notif-item-title">{item.title}</span>
            <span className="nav-notif-item-sub">
              {profile
                ? <span className={`dynamic-color-dot nav-notif-profile-dot ${profileTheme}`} title={profile.name} />
                : <span className="dynamic-color-dot nav-notif-profile-dot profile-dot-missing" aria-hidden="true" />}
              {!profile && <span className="nav-notif-item-date">{t('common.profileField.none')} •</span>}
              <span className="nav-notif-item-date">
                {formatDate(item.date)} • {getUpcomingDaysLabel(t, item)}
              </span>
            </span>
          </span>
        </button>
        <button
          type="button"
          className="nav-notif-dismiss"
          onClick={() => onDismiss(item)}
          title={t('common.notifications.dismiss')}
          aria-label={t('common.notifications.dismiss')}
        >
          <X size={13} />
        </button>
      </div>
    );
  };

  return (
    <div className="nav-notifications-dropdown">
      <div className="nav-notif-header">
        <span className="nav-notif-title">{t('common.notifications.title')}</span>
        {count > 0 && !isMuted && <span className="upcoming-count-pill">{count}</span>}
      </div>
      {isMuted && <div className="nav-notif-muted">{t('common.notifications.mutedNotice')}</div>}

      <div className="nav-notif-list">
        {count === 0 ? (
          <div className="nav-notif-empty">{t('common.notifications.empty')}</div>
        ) : (
          <UpcomingGroupedList items={items} renderItem={renderItem} />
        )}
      </div>

      <div className="nav-notif-footer">
        <button type="button" className="nav-notif-manage-btn" onClick={onOpenCenter}>
          <SlidersHorizontal size={13} />
          <span>{t('common.notifications.manageCenter')}</span>
        </button>
      </div>
    </div>
  );
}
