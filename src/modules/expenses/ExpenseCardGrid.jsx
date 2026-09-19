import React from 'react';
import { ExpenseCard } from './ExpenseCard';
import { YearGroupedExpenseGrid } from './YearGroupedExpenseGrid';

export function ExpenseCardGrid(props) {
  const { expenses = [], profiles } = props;
  const distinctYears = new Set(
    expenses.map((e) => e.dueYear || (e.dueDate ? new Date(e.dueDate).getFullYear() : null)).filter(Boolean)
  );

  if (distinctYears.size > 1) {
    return <YearGroupedExpenseGrid {...props} />;
  }

  return (
    <div className="grid-cards">
      {expenses.map((exp) => (
        <ExpenseCard
          key={`${exp.id}-${exp.dueDate || exp.nextDueDate}`}
          expense={exp}
          dueDate={exp.dueDate || exp.nextDueDate}
          profile={profiles.find((p) => p.id === exp.profileId)}
          onEdit={props.onEdit}
          onDelete={props.onDelete}
          onToggleAlert={props.onToggleAlert}
          onToggleCalendar={props.onToggleCalendar}
          onMarkPaid={props.onMarkPaid}
          onOpenHistory={props.onOpenHistory}
          onNavigateYear={props.onNavigateYear}
        />
      ))}
    </div>
  );
}
