import React, { useState } from 'react';
import { ChevronRight, ShieldCheck } from 'lucide-react';
import { useI18n } from '../../core/i18n';
import { UpcomingDeadlinesRow } from './UpcomingDeadlinesRow';
import { UpcomingDetailModal } from './UpcomingDetailModal';
import './ConsolidatedUpcomingCard.css';

export function ConsolidatedUpcomingCard({
  items = [],
  profiles = [],
  onOpenNotificationCenter,
}) {
  const { t } = useI18n();
  const [activeItem, setActiveItem] = useState(null);

  const pillText = t('budget.metrics.upcomingCountPill').replace('{count}', items.length);

  return (
    <div className="kpi-card kpi-card-upcoming">
      <div className="kpi-header">
        <span className="kpi-label">{t('budget.metrics.upcomingDeadlines')}</span>
        {items.length > 0 && onOpenNotificationCenter ? (
          <button
            type="button"
            className="upcoming-header-badge-btn"
            onClick={onOpenNotificationCenter}
            title={t('common.notifications.centerTitle')}
          >
            <span>{pillText}</span>
            <ChevronRight size={13} />
          </button>
        ) : (
          <span className="upcoming-count-pill">{pillText}</span>
        )}
      </div>

      {items.length === 0 ? (
        <div className="upcoming-empty-card">
          <ShieldCheck size={18} className="upcoming-empty-icon" />
          <div className="upcoming-empty-text-group">
            <span className="upcoming-empty-title">{t('budget.metrics.noUpcoming')}</span>
            <span className="upcoming-empty-desc">{t('budget.metrics.noUpcomingDesc')}</span>
          </div>
        </div>
      ) : (
        <div className="consolidated-upcoming-list">
          {items.slice(0, 2).map((item) => (
            <UpcomingDeadlinesRow
              key={item.id}
              item={item}
              profile={profiles.find((p) => p.id === item.profileId)}
              onSelect={setActiveItem}
            />
          ))}
          {items.length > 2 && onOpenNotificationCenter && (
            <button
              type="button"
              className="consolidated-upcoming-more-row"
              onClick={onOpenNotificationCenter}
            >
              <span>{t('budget.metrics.moreUpcoming').replace('{count}', items.length - 2)}</span>
              <ChevronRight size={14} />
            </button>
          )}
        </div>
      )}

      <UpcomingDetailModal
        item={activeItem}
        isOpen={Boolean(activeItem)}
        onClose={() => setActiveItem(null)}
      />
    </div>
  );
}
