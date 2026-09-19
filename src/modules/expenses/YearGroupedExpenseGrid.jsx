import React from 'react';
import { Calendar } from 'lucide-react';
import { useI18n } from '../../core/i18n';
import { ExpenseCard } from './ExpenseCard';
import { formatCurrency } from './expenseHelpers';
import './YearGroupedExpenseGrid.css';

export function YearGroupedExpenseGrid({
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

  const groupedByYear = expenses.reduce((acc, exp) => {
    const y = exp.dueYear || (exp.dueDate ? new Date(exp.dueDate).getFullYear() : 'other');
    if (!acc[y]) acc[y] = [];
    acc[y].push(exp);
    return acc;
  }, {});

  const years = Object.keys(groupedByYear).sort((a, b) => Number(a) - Number(b));

  return (
    <div className="year-grouped-container">
      {years.map((year) => {
        const items = groupedByYear[year];
        const yearTotal = items.reduce((sum, item) => sum + (Number(item.amount) || 0), 0);
        return (
          <section key={year} className="expense-year-section" id={`year-section-${year}`}>
            <header className="expense-year-header">
              <div className="expense-year-title-group">
                <span className="expense-year-badge">
                  <Calendar size={15} />
                  <span>{year}</span>
                </span>
                <span className="expense-year-count">
                  {t('expenses.yearFilter.installmentsCount').replace('{count}', items.length)}
                </span>
              </div>
              <div className="expense-year-meta">
                <span className="expense-year-total-label">{t('expenses.yearFilter.yearTotal')}:</span>
                <strong className="expense-year-total-amount">{formatCurrency(yearTotal)}</strong>
              </div>
            </header>

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
          </section>
        );
      })}
    </div>
  );
}
