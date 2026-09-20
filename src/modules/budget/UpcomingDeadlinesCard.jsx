import React, { useState } from 'react';
import { Calendar, Receipt, FileText, ChevronRight, ShieldCheck } from 'lucide-react';
import { useI18n } from '../../core/i18n';
import { formatCurrency } from '../expenses/expenseHelpers';
import { UpcomingDetailModal } from './UpcomingDetailModal';
import './UpcomingDeadlinesCard.css';

export function UpcomingDeadlinesCard({ items = [] }) {
  const { t } = useI18n();
  const [activeItem, setActiveItem] = useState(null);

  if (!items || items.length === 0) {
    return (
      <div className="upcoming-empty-card">
        <ShieldCheck size={20} className="upcoming-empty-icon" />
        <div className="upcoming-empty-text-group">
          <span className="upcoming-empty-title">{t('budget.metrics.noUpcoming')}</span>
          <span className="upcoming-empty-desc">{t('budget.metrics.noUpcomingDesc')}</span>
        </div>
      </div>
    );
  }

  const pillText = t('budget.metrics.upcomingCountPill').replace('{count}', items.length);

  return (
    <div className="upcoming-deadlines-section">
      <div className="upcoming-deadlines-card">
        <div className="upcoming-card-header">
          <div className="upcoming-card-title-group">
            <Calendar size={16} className="upcoming-header-icon" />
            <span>{t('budget.metrics.upcomingDeadlines')}</span>
          </div>
          <span className="upcoming-count-pill">{pillText}</span>
        </div>

        <div className="upcoming-items-list">
          {items.map((item) => {
            const isExp = item.itemType === 'expense';
            const daysLabel = item.diffDays === 0
              ? t('budget.metrics.dueToday')
              : t('budget.metrics.inDays').replace('{days}', item.diffDays);

            return (
              <div
                key={item.id}
                className="upcoming-item-row"
                onClick={() => setActiveItem(item)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === 'Enter' && setActiveItem(item)}
              >
                <div className="upcoming-item-left">
                  <div className="upcoming-item-icon-box">
                    {isExp ? <Receipt size={14} /> : <FileText size={14} />}
                  </div>
                  <div className="upcoming-item-info">
                    <span className="upcoming-item-title">{item.title}</span>
                    <span className="upcoming-item-sub">{item.date}</span>
                  </div>
                </div>

                <div className="upcoming-item-right">
                  {isExp && <span className="upcoming-item-amount">{formatCurrency(item.amount)}</span>}
                  <span className="upcoming-item-days">{daysLabel}</span>
                  <ChevronRight size={14} className="upcoming-item-chevron" />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <UpcomingDetailModal
        item={activeItem}
        isOpen={Boolean(activeItem)}
        onClose={() => setActiveItem(null)}
      />
    </div>
  );
}
