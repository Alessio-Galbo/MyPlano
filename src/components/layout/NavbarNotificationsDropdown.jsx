import React from 'react';
import { Receipt, FileText, X, SlidersHorizontal } from 'lucide-react';
import { useI18n } from '../../core/i18n';
import { ensureProfileClass } from '../../core/theme/dynamicThemeService';

export function NavbarNotificationsDropdown({
  items = [],
  profiles = [],
  count = 0,
  onItemClick,
  onDismiss,
  onOpenCenter,
}) {
  const { t } = useI18n();

  return (
    <div className="nav-notifications-dropdown">
      <div className="nav-notif-header">
        <span className="nav-notif-title">{t('common.notifications.title')}</span>
        {count > 0 && <span className="upcoming-count-pill">{count}</span>}
      </div>

      <div className="nav-notif-list">
        {count === 0 ? (
          <div className="nav-notif-empty">{t('common.notifications.empty')}</div>
        ) : (
          items.map((item) => {
            const isExp = item.itemType === 'expense';
            const profile = profiles.find((p) => p.id === item.profileId);
            const profileTheme = profile ? ensureProfileClass(profile.id) : '';

            return (
              <div
                key={item.id}
                className="nav-notif-item"
                onClick={() => onItemClick(item)}
                role="button"
                tabIndex={0}
              >
                <div className="nav-notif-item-left">
                  <div className={`nav-notif-icon ${isExp ? 'expense' : 'document'}`}>
                    {isExp ? <Receipt size={14} /> : <FileText size={14} />}
                  </div>
                  <div className="nav-notif-text">
                    <span className="nav-notif-item-title">{item.title}</span>
                    <span className="nav-notif-item-sub">
                      {profile && <span className={`dynamic-color-dot nav-notif-profile-dot ${profileTheme}`} title={profile.name} />}
                      <span className="nav-notif-item-date">{item.date}</span>
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  className="nav-notif-dismiss"
                  onClick={(e) => onDismiss(e, item.id)}
                  title={t('common.notifications.dismiss')}
                  aria-label={t('common.notifications.dismiss')}
                >
                  <X size={13} />
                </button>
              </div>
            );
          })
        )}
      </div>

      <div className="nav-notif-footer">
        <button
          type="button"
          className="nav-notif-manage-btn"
          onClick={onOpenCenter}
        >
          <SlidersHorizontal size={13} />
          <span>{t('common.notifications.manageCenter')}</span>
        </button>
      </div>
    </div>
  );
}
