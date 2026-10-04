import React, { useState } from 'react';
import { Calendar, ShieldCheck } from 'lucide-react';
import { useI18n } from '../../core/i18n';
import { UpcomingDeadlinesRow } from './UpcomingDeadlinesRow';
import { UpcomingDetailModal } from './UpcomingDetailModal';
import { UpcomingGroupedList } from './UpcomingGroupedList';
import './UpcomingDeadlinesCard.css';

export function UpcomingDeadlinesCard({ items = [], profiles = [] }) {
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
          <UpcomingGroupedList
            items={items}
            renderItem={(item) => (
              <UpcomingDeadlinesRow
                key={item.id}
                item={item}
                profile={profiles.find((p) => p.id === item.profileId)}
                onSelect={setActiveItem}
              />
            )}
          />
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
