import React from 'react';
import { Receipt, FileText, X } from 'lucide-react';
import { useI18n } from '../../core/i18n';
import { formatCurrency } from '../../modules/expenses/expenseHelpers';

export function NotificationCenterItem({ item, onViewDetails, onDismiss }) {
  const { t } = useI18n();
  const isExp = item.itemType === 'expense';
  const inDaysText = t('common.notifications.inDays').replace('{days}', item.diffDays);

  return (
    <div className="notif-center-item">
      <div className="notif-center-item-left">
        <div className="notif-center-icon-pill">
          {isExp ? <Receipt size={15} /> : <FileText size={15} />}
        </div>
        <div className="notif-center-info">
          <span className="notif-center-item-title">{item.title}</span>
          <span className="notif-center-item-sub">
            {item.date} • {inDaysText}
          </span>
        </div>
      </div>

      <div className="notif-center-item-right">
        {isExp && <span className="notif-center-amount">{formatCurrency(item.amount)}</span>}
        <button
          type="button"
          className="notif-view-btn"
          onClick={() => onViewDetails(item)}
          title={t('common.notifications.viewDetails')}
        >
          {t('common.notifications.viewDetails')}
        </button>
        <button
          type="button"
          className="notif-dismiss-btn"
          onClick={() => onDismiss(item.id)}
          title={t('common.notifications.dismiss')}
          aria-label={t('common.notifications.dismiss')}
        >
          <X size={14} />
        </button>
      </div>
    </div>
  );
}
