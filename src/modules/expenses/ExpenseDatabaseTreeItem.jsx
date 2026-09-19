import React from 'react';
import { formatCurrency } from './expenseHelpers';

export function ExpenseDatabaseTreeItem({
  expense,
  isSelected,
  onSelect,
}) {
  return (
    <button
      type="button"
      className={`tree-leaf-item ${isSelected ? 'selected' : ''}`}
      onClick={() => onSelect(expense.id)}
    >
      <span className={`tree-leaf-dot cat-dot-${expense.category || 'other'}`} />
      <span className="tree-leaf-title" title={expense.title}>
        {expense.title}
      </span>
      <span className="tree-leaf-amount">
        {formatCurrency(expense.yearAmount ?? expense.amount)}
      </span>
    </button>
  );
}
