import React from 'react';
import { Filter, ChevronDown } from 'lucide-react';
import { useI18n } from '../../core/i18n';
import { getCategoryLabel } from '../expenses/expenseHelpers';
import './TimelineCategoryFilter.css';

export function TimelineCategoryFilter({
  categories = [],
  selectedCategory = 'all',
  onSelectCategory,
}) {
  const { t } = useI18n();

  if (categories.length <= 1) return null;

  return (
    <div className="timeline-category-filter">
      <Filter size={14} className="timeline-filter-icon" />
      <div className="timeline-select-wrapper">
        <select
          className="timeline-category-select"
          value={selectedCategory}
          onChange={(e) => onSelectCategory(e.target.value)}
          aria-label="Filtra categoria timeline"
        >
          <option value="all">{t('common.actions.all')} ({t('expenses.title')})</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {getCategoryLabel(cat, t)}
            </option>
          ))}
        </select>
        <ChevronDown size={13} className="timeline-select-arrow" />
      </div>
    </div>
  );
}
