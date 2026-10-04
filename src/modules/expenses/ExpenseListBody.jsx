import React from 'react';
import { ExpenseCardGrid } from './ExpenseCardGrid';
import { CategoryGroupedView } from './CategoryGroupedView';
import { ExpenseCategoryFilter } from './ExpenseCategoryFilter';
import { ExpenseYearSelector } from './ExpenseYearSelector';
import { ExpenseEmptyState } from './ExpenseEmptyState';

// Filters + cards (or the empty state) of the expenses tab.
export function ExpenseListBody({ state, filterData, commonProps, expenses, profiles, selectedProfileId, onCreate }) {
  const isEmpty = filterData.displayedExpenses.length === 0;
  return (
    <>
      <ExpenseYearSelector selectedRange={state.selectedYearRange} onSelectRange={state.setSelectedYearRange} />
      <ExpenseCategoryFilter
        categories={filterData.categories} selectedCategory={filterData.effectiveCategory}
        onSelectCategory={state.setSelectedCategory} counts={filterData.counts}
      />
      {isEmpty ? (
        <ExpenseEmptyState
          expenses={expenses} profiles={profiles} selectedProfileId={selectedProfileId} onCreate={onCreate}
        />
      ) : state.viewMode === 'grouped' ? (
        <CategoryGroupedView {...commonProps} />
      ) : (
        <ExpenseCardGrid {...commonProps} />
      )}
    </>
  );
}
