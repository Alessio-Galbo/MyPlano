import React from 'react';
import { useI18n } from '../../core/i18n';
import { ExpenseCard } from './ExpenseCard';
import { calculateItemAnnualCost } from '../budget/calculations/coreMetrics';
import { formatCurrency, getCategoryLabel } from './expenseHelpers';
import './CategoryGroupedView.css';

export function CategoryGroupedView({
  expenses,
  profiles,
  onEdit,
  onDelete,
  onToggleAlert,
  onToggleCalendar,
  onMarkPaid,
  onOpenHistory,
  onNavigateYear,
}) {
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
      {categories.map((cat) => {
        const items = grouped[cat];
        const annualTotal = items.reduce((sum, item) => sum + calculateItemAnnualCost(item), 0);

        return (
          <div key={cat} className="category-group-section">
            <div className="category-group-header">
              <h3 className="category-group-title">{getCategoryLabel(cat, t)}</h3>
              <div className="category-group-meta">
                <span>{items.length} {items.length === 1 ? 'voce' : 'voci'}</span>
                <span className="category-group-total">
                  Totale: <strong>{formatCurrency(annualTotal)}</strong> / anno ({formatCurrency(annualTotal / 12)} / mese)
                </span>
              </div>
            </div>

            <div className="grid-cards">
              {items.map((exp) => (
                <ExpenseCard
                  key={`${exp.id}-${exp.dueDate || exp.nextDueDate}`}
                  expense={exp}
                  dueDate={exp.dueDate || exp.nextDueDate}
                  profile={profiles.find((p) => p.id === exp.profileId)}
                  onEdit={onEdit}
                  onDelete={onDelete}
                  onToggleAlert={onToggleAlert}
                  onToggleCalendar={onToggleCalendar}
                  onMarkPaid={onMarkPaid}
                  onOpenHistory={onOpenHistory}
                  onNavigateYear={onNavigateYear}
                />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
