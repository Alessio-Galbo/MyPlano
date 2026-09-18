import React from 'react';
import { useI18n } from '../../core/i18n';
import { getCategoryLabel } from './expenseHelpers';
import { ensureCategoryClass } from '../../core/theme/dynamicThemeService';
import './ExpenseCategoryFilter.css';

export function ExpenseCategoryFilter({
  categories = [],
  selectedCategory = 'all',
  onSelectCategory,
  counts = {},
}) {
  const { t } = useI18n();

  if (categories.length <= 1) return null;

  return (
    <div className="expense-category-filter-bar">
      <button
        type="button"
        className={`cat-filter-pill ${selectedCategory === 'all' ? 'active' : ''}`}
        onClick={() => onSelectCategory('all')}
      >
        <span>{t('common.actions.all')}</span>
        {counts.all !== undefined && (
          <span className="cat-filter-count">{counts.all}</span>
        )}
      </button>

      {categories.map((cat) => {
        const isActive = selectedCategory === cat;
        const count = counts[cat] || 0;
        const themeClass = ensureCategoryClass(cat);
        return (
          <button
            key={cat}
            type="button"
            className={`cat-filter-pill ${isActive ? 'active' : ''}`}
            onClick={() => onSelectCategory(cat)}
          >
            <span className={`dynamic-color-dot ${themeClass}`} />
            <span>{getCategoryLabel(cat, t)}</span>
            <span className="cat-filter-count">{count}</span>
          </button>
        );
      })}
    </div>
  );
}
