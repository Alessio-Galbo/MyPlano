import React from 'react';
import { ChevronDown, ChevronRight, Calendar } from 'lucide-react';
import { ExpenseDatabaseTreeItem } from './ExpenseDatabaseTreeItem';
import './ExpenseDatabaseYearGroup.css';

export function ExpenseDatabaseYearGroup({
  year,
  expenses,
  isExpanded,
  onToggle,
  selectedExpenseId,
  onSelectExpense,
}) {
  return (
    <div className="tree-year-group">
      <button
        type="button"
        className="tree-year-header"
        onClick={() => onToggle(year)}
      >
        <span className="tree-year-icon-wrap">
          {isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
          <Calendar size={13} className="tree-calendar-icon" />
        </span>
        <span className="tree-year-label">{year}</span>
        <span className="tree-year-count">{expenses.length}</span>
      </button>

      {isExpanded && (
        <div className="tree-year-leaves">
          {expenses.map((exp) => (
            <ExpenseDatabaseTreeItem
              key={`${year}-${exp.id}`}
              expense={exp}
              isSelected={exp.id === selectedExpenseId}
              onSelect={onSelectExpense}
            />
          ))}
        </div>
      )}
    </div>
  );
}
