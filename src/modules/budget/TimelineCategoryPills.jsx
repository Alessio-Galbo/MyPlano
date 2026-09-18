import React from 'react';
import { PieChart, Table } from 'lucide-react';
import { useI18n } from '../../core/i18n';
import { getCategoryLabel } from '../expenses/expenseHelpers';
import { ensureCategoryClass } from '../../core/theme/dynamicThemeService';
import './TimelineCategoryPills.css';

export function TimelineCategoryPills({
  categories = [],
  selectedCategory = 'all',
  onSelectCategory,
  categoryTotals = {},
  totalAmount = 0,
  viewMode = 'timeline',
  onToggleViewMode,
}) {
  const { t } = useI18n();
  const formatCompact = (v) =>
    Number(v || 0).toLocaleString('it-IT', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 });

  return (
    <div className="timeline-category-bar">
      <div className="timeline-category-mobile-select">
        <select
          className="category-dropdown-select"
          value={selectedCategory}
          onChange={(e) => onSelectCategory(e.target.value)}
          aria-label={t('budget.simulation.allCategories')}
        >
          <option value="all">
            {t('budget.simulation.allCategories')} ({formatCompact(totalAmount)})
          </option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {getCategoryLabel(cat, t)} ({formatCompact(categoryTotals[cat] || 0)})
            </option>
          ))}
        </select>
      </div>

      <div className="timeline-category-pills">
        <button
          type="button"
          className={`category-pill ${selectedCategory === 'all' ? 'active' : ''}`}
          onClick={() => onSelectCategory('all')}
        >
          <span className="category-pill-name">{t('budget.simulation.allCategories')}</span>
          <span className="category-pill-total">{formatCompact(totalAmount)}</span>
        </button>

        {categories.map((cat) => {
          const isActive = selectedCategory === cat;
          const themeClass = ensureCategoryClass(cat);
          const catSum = categoryTotals[cat] || 0;
          return (
            <button
              key={cat}
              type="button"
              className={`category-pill dynamic-cat-pill ${themeClass} ${isActive ? 'active' : ''}`}
              onClick={() => onSelectCategory(cat)}
            >
              <span className={`dynamic-color-dot ${themeClass}`} />
              <span className="category-pill-name">{getCategoryLabel(cat, t)}</span>
              <span className="category-pill-total">{formatCompact(catSum)}</span>
            </button>
          );
        })}
      </div>

      <div className="timeline-view-switch">
        <button
          type="button"
          className={`timeline-view-toggle-btn ${viewMode === 'pie' ? 'active' : ''}`}
          onClick={onToggleViewMode}
          title={viewMode === 'pie' ? t('budget.simulation.viewTimeline') : t('budget.simulation.viewPieChart')}
        >
          {viewMode === 'pie' ? <Table size={14} /> : <PieChart size={14} />}
          <span>{viewMode === 'pie' ? t('budget.simulation.viewTimeline') : t('budget.simulation.viewPieChart')}</span>
        </button>
      </div>
    </div>
  );
}
