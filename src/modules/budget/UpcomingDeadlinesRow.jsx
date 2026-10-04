import React from 'react';
import { Receipt, FileText, ChevronRight } from 'lucide-react';
import { useI18n } from '../../core/i18n';
import { formatCurrency } from '../expenses/expenseHelpers';
import { formatDate } from '../documents/documentHelpers';
import { ensureProfileClass } from '../../core/theme/dynamicThemeService';
import { getUpcomingDaysLabel } from './upcomingDaysLabel';
import '../../core/profiles/profileField.css';

export function UpcomingDeadlinesRow({ item, profile, onSelect }) {
  const { t } = useI18n();
  const isExp = item.itemType === 'expense';
  const daysLabel = getUpcomingDaysLabel(t, item);
  const profileTheme = profile ? ensureProfileClass(profile.id) : '';

  return (
    <button
      type="button"
      className={`upcoming-item-row ${item.isOverdue ? 'is-overdue' : ''}`}
      onClick={() => onSelect(item)}
    >
      <span className="upcoming-item-left">
        <span className={`upcoming-item-icon-box ${isExp ? 'expense' : 'document'}`}>
          {isExp ? <Receipt size={14} /> : <FileText size={14} />}
        </span>
        <span className="upcoming-item-info">
          <span className="upcoming-item-title">{item.title}</span>
          <span className="upcoming-item-sub">
            <span className="notif-profile-badge">
              <span className={`dynamic-color-dot ${profile ? profileTheme : 'profile-dot-missing'}`} />
              <span>{profile ? profile.name : t('common.profileField.none')}</span>
              <span>•</span>
            </span>
            <span>{formatDate(item.date)}</span>
          </span>
        </span>
      </span>

      <span className="upcoming-item-right">
        {isExp && <span className="upcoming-item-amount">{formatCurrency(item.amount)}</span>}
        <span className="upcoming-item-days">{daysLabel}</span>
        <ChevronRight size={14} className="upcoming-item-chevron" />
      </span>
    </button>
  );
}
