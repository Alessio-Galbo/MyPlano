import React from 'react';
import { ExpenseCard } from './ExpenseCard';

export function ExpenseCardGrid({
  expenses,
  profiles,
  onEdit,
  onDelete,
  onToggleAlert,
  onToggleCalendar,
  onMarkPaid,
  onOpenHistory,
}) {
  return (
    <div className="grid-cards">
      {expenses.map((exp) => (
        <ExpenseCard
          key={exp.id}
          expense={exp}
          profile={profiles.find((p) => p.id === exp.profileId)}
          onEdit={onEdit}
          onDelete={onDelete}
          onToggleAlert={onToggleAlert}
          onToggleCalendar={onToggleCalendar}
          onMarkPaid={onMarkPaid}
          onOpenHistory={onOpenHistory}
        />
      ))}
    </div>
  );
}
