import React from 'react';
import { Receipt, FileText, ChevronRight } from 'lucide-react';
import { useI18n } from '../../core/i18n';
import { formatCurrency } from '../expenses/expenseHelpers';
import { formatDate } from '../documents/documentHelpers';
import { ensureProfileClass } from '../../core/theme/dynamicThemeService';

export function UpcomingDeadlinesRow({ item, profile, onSelect }) {
  const { t } = useI18n();
  const isExp = item.itemType === 'expense';
  const daysLabel = item.diffDays === 0
    ? t('budget.metrics.dueToday')
    : t('budget.metrics.inDays').replace('{days}', item.diffDays);
  const profileTheme = profile ? ensureProfileClass(profile.id) : '';

  return (
    <div
      className="upcoming-item-row"
      onClick={() => onSelect(item)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && onSelect(item)}
    >
      <div className="upcoming-item-left">
        <div className={`upcoming-item-icon-box ${isExp ? 'expense' : 'document'}`}>
          {isExp ? <Receipt size={14} /> : <FileText size={14} />}
        </div>
        <div className="upcoming-item-info">
          <span className="upcoming-item-title">{item.title}</span>
          <span className="upcoming-item-sub">
            {profile && (
              <span className="notif-profile-badge">
                <span className={`dynamic-color-dot ${profileTheme}`} />
                <span>{profile.name}</span>
                <span>•</span>
              </span>
            )}
            <span>{formatDate(item.date)}</span>
          </span>
        </div>
      </div>

      <div className="upcoming-item-right">
        {isExp && <span className="upcoming-item-amount">{formatCurrency(item.amount)}</span>}
        <span className="upcoming-item-days">{daysLabel}</span>
        <ChevronRight size={14} className="upcoming-item-chevron" />
      </div>
    </div>
  );
}
