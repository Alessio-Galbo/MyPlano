import React from 'react';
import { useI18n } from '../../core/i18n';
import { ExpenseCard } from './ExpenseCard';
import { calculateItemAnnualCost } from '../budget/calculations/coreMetrics';
import { formatCurrency, getCategoryLabel } from './expenseHelpers';
import { ensureCategoryClass } from '../../core/theme/dynamicThemeService';
import './CategoryGroupedView.css';

export function CategoryGroupedView(props) {
  const { expenses, profiles, onEdit, onDelete, onToggleAlert, onToggleCalendar, onMarkPaid, onOpenHistory, onNavigateYear } = props;
  const { t } = useI18n();

  const grouped = expenses.reduce((acc, exp) => {
    const cat = exp.category || 'other';
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(exp);
    return acc;
  }, {});

  const categories = Object.keys(grouped);

  return (
    <div className="category-groups-container">
      {categories.map((cat, idx) => {
        const items = grouped[cat];
        const unique = Array.from(new Map(items.map((it) => [it.id, it])).values());
        const annualRate = unique.reduce((sum, it) => sum + calculateItemAnnualCost(it), 0);
        const periodTotal = items.reduce((sum, it) => sum + (Number(it.amount) || 0), 0);
        const isMulti = new Set(items.map((it) => it.dueYear || new Date(it.dueDate).getFullYear())).size > 1;

        const countText = items.length === 1
          ? t('expenses.viewMode.itemsCountOne')
          : t('expenses.viewMode.itemsCountMany').replace('{count}', items.length);

        const themeClass = ensureCategoryClass(cat, idx);

        return (
          <section key={cat} className={`category-group-section ${themeClass}`} id={`category-section-${cat}`}>
            <header className="category-group-header">
              <div className="category-title-group">
                <span className="category-badge-pill">
                  <span className={`dynamic-color-dot ${themeClass}`} />
                  <span>{getCategoryLabel(cat, t)}</span>
                </span>
                <span className="category-header-count">{countText}</span>
              </div>
              <div className="category-header-meta">
                {isMulti ? (
                  <>
                    <span className="category-meta-label">{t('expenses.viewMode.periodTotalLabel')}:</span>
                    <strong className="category-meta-amount">{formatCurrency(periodTotal)}</strong>
                    <span className="category-meta-sep">•</span>
                    <span className="category-meta-label">{t('expenses.viewMode.quotaLabel')}:</span>
                    <strong className="category-meta-amount">{formatCurrency(annualRate)}</strong>
                    <span className="category-meta-unit">{t('expenses.viewMode.perYear')}</span>
                  </>
                ) : (
                  <>
                    <span className="category-meta-label">{t('expenses.yearFilter.yearTotal')}:</span>
                    <strong className="category-meta-amount">{formatCurrency(periodTotal)}</strong>
                    <span className="category-meta-unit">({formatCurrency(annualRate / 12)} {t('expenses.viewMode.perMonth')})</span>
                  </>
                )}
              </div>
            </header>

            <div className="grid-cards">
              {items.map((exp) => (
                <ExpenseCard
                  key={`${exp.id}-${exp.dueDate || exp.nextDueDate}`}
                  expense={exp} dueDate={exp.dueDate || exp.nextDueDate}
                  profile={profiles.find((p) => p.id === exp.profileId)}
                  onEdit={onEdit} onDelete={onDelete}
                  onToggleAlert={onToggleAlert} onToggleCalendar={onToggleCalendar}
                  onMarkPaid={onMarkPaid} onOpenHistory={onOpenHistory} onNavigateYear={onNavigateYear}
                />
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}
