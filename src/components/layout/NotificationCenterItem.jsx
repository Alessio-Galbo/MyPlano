import React from 'react';
import { Receipt, FileText, Eye, EyeOff } from 'lucide-react';
import { useI18n } from '../../core/i18n';
import { formatCurrency } from '../../modules/expenses/expenseHelpers';
import { formatDate } from '../../modules/documents/documentHelpers';
import { ensureProfileClass } from '../../core/theme/dynamicThemeService';

export function NotificationCenterItem({
  item,
  profiles = [],
  isHidden = false,
  onViewDetails,
  onToggleVisibility,
}) {
  const { t } = useI18n();
  const isExp = item.itemType === 'expense';
  const inDaysText = t('common.notifications.inDays').replace('{days}', item.diffDays);
  const profile = profiles.find((p) => p.id === item.profileId);
  const profileTheme = profile ? ensureProfileClass(profile.id) : '';

  return (
    <div
      className={`notif-center-item ${isHidden ? 'is-hidden' : ''}`}
      onClick={() => onViewDetails(item)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && onViewDetails(item)}
    >
      <div className={`notif-center-icon-pill ${isExp ? 'expense' : 'document'}`}>
        {isExp ? <Receipt size={16} /> : <FileText size={16} />}
      </div>

      <div className="notif-center-content">
        <div className="notif-center-row-top">
          <span className="notif-center-item-title">{item.title}</span>
          {isExp && <span className="notif-center-amount">{formatCurrency(item.amount)}</span>}
        </div>

        <div className="notif-center-row-bottom">
          {profile && (
            <span className="notif-profile-badge">
              <span className={`dynamic-color-dot ${profileTheme}`} />
              <span>{profile.name}</span>
              <span className="notif-dot-sep">•</span>
            </span>
          )}
          <span className="notif-date-val">{formatDate(item.date)}</span>
          <span className="notif-dot-sep">•</span>
          <span className="notif-days-val">{inDaysText}</span>
        </div>
      </div>

      <button
        type="button"
        className={`notif-visibility-btn ${isHidden ? 'is-hidden' : ''}`}
        onClick={(e) => {
          e.stopPropagation();
          onToggleVisibility(item.id);
        }}
        title={isHidden ? t('common.notifications.showNotification') : t('common.notifications.hideNotification')}
        aria-label={isHidden ? t('common.notifications.showNotification') : t('common.notifications.hideNotification')}
      >
        {isHidden ? <EyeOff size={15} /> : <Eye size={15} />}
      </button>
    </div>
  );
}
