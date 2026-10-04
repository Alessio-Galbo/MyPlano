import React from 'react';
import { Receipt, FileText, Eye, EyeOff } from 'lucide-react';
import { useI18n } from '../../core/i18n';
import { formatCurrency } from '../../modules/expenses/expenseHelpers';
import { formatDate } from '../../modules/documents/documentHelpers';
import { getUpcomingDaysLabel } from '../../modules/budget/upcomingDaysLabel';
import { ensureProfileClass } from '../../core/theme/dynamicThemeService';
import '../../core/profiles/profileField.css';

export function NotificationCenterItem({
  item,
  profiles = [],
  isHidden = false,
  onViewDetails,
  onToggleVisibility,
}) {
  const { t } = useI18n();
  const isExp = item.itemType === 'expense';
  const profile = profiles.find((p) => p.id === item.profileId);
  const profileTheme = profile ? ensureProfileClass(profile.id) : '';
  const toggleLabel = isHidden
    ? t('common.notifications.showNotification')
    : t('common.notifications.hideNotification');

  return (
    <div
      className={`notif-center-item ${isHidden ? 'is-hidden' : ''} ${item.isOverdue ? 'is-overdue' : ''}`}
      data-notif-id={item.id}
    >
      <button type="button" className="notif-center-main" onClick={() => onViewDetails(item)}>
        <span className={`notif-center-icon-pill ${isExp ? 'expense' : 'document'}`}>
          {isExp ? <Receipt size={16} /> : <FileText size={16} />}
        </span>

        <span className="notif-center-content">
          <span className="notif-center-row-top">
            <span className="notif-center-item-title">{item.title}</span>
            {isExp && <span className="notif-center-amount">{formatCurrency(item.amount)}</span>}
          </span>

          <span className="notif-center-row-bottom">
            <span className="notif-profile-badge">
              <span className={`dynamic-color-dot ${profile ? profileTheme : 'profile-dot-missing'}`} />
              <span>{profile ? profile.name : t('common.profileField.none')}</span>
              <span className="notif-dot-sep">•</span>
            </span>
            <span className="notif-date-val">{formatDate(item.date)}</span>
            <span className="notif-dot-sep">•</span>
            <span className="notif-days-val">{getUpcomingDaysLabel(t, item)}</span>
            {!item.alertEnabled && (
              <span className="notif-alert-off">{t('common.notifications.alertOff')}</span>
            )}
          </span>
        </span>
      </button>

      <button
        type="button"
        className={`notif-visibility-btn ${isHidden ? 'is-hidden' : ''}`}
        onClick={() => onToggleVisibility(item)}
        title={toggleLabel}
        aria-label={toggleLabel}
        aria-pressed={isHidden}
      >
        {isHidden ? <EyeOff size={15} /> : <Eye size={15} />}
      </button>
    </div>
  );
}
