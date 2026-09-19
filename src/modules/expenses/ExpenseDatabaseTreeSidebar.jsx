import React from 'react';
import { Search, Calendar, ArrowDown10, ArrowUp01, ArrowDownAZ, Eye, EyeOff } from 'lucide-react';
import { ExpenseDatabaseYearGroup } from './ExpenseDatabaseYearGroup';
import './ExpenseDatabaseTreeSidebar.css';

export function ExpenseDatabaseTreeSidebar({
  searchQuery,
  onSearchChange,
  treeData,
  expandedYears,
  onToggleYear,
  selectedExpenseId,
  onSelectExpense,
  yearSort = 'desc',
  onToggleYearSort,
  expenseSort = 'date',
  onToggleExpenseSort,
  hidePastYears = false,
  onToggleHidePastYears,
  t,
}) {
  return (
    <div className="tree-sidebar-container">
      <div className="tree-search-bar">
        <Search size={15} className="tree-search-icon" />
        <input
          type="text"
          className="tree-search-input"
          placeholder={t('expenses.databaseHub.searchPlaceholder')}
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>

      <div className="tree-sort-toolbar">
        <button
          type="button"
          className="tree-sort-btn"
          onClick={onToggleYearSort}
          title={yearSort === 'desc' ? t('expenses.databaseHub.sortYearsDesc') : t('expenses.databaseHub.sortYearsAsc')}
        >
          {yearSort === 'desc' ? <ArrowDown10 size={13} /> : <ArrowUp01 size={13} />}
          <span>{yearSort === 'desc' ? t('expenses.databaseHub.sortRecent') : t('expenses.databaseHub.sortOld')}</span>
        </button>

        <button
          type="button"
          className={`tree-sort-btn icon-only ${hidePastYears ? 'active' : ''}`}
          onClick={onToggleHidePastYears}
          title={hidePastYears ? t('expenses.databaseHub.showPastYears') : t('expenses.databaseHub.hidePastYears')}
        >
          {hidePastYears ? <EyeOff size={13} /> : <Eye size={13} />}
        </button>

        <button
          type="button"
          className="tree-sort-btn"
          onClick={onToggleExpenseSort}
          title={expenseSort === 'date' ? t('expenses.databaseHub.sortExpensesDate') : t('expenses.databaseHub.sortExpensesAlpha')}
        >
          {expenseSort === 'date' ? <Calendar size={13} /> : <ArrowDownAZ size={13} />}
          <span>{expenseSort === 'date' ? t('expenses.databaseHub.sortDate') : t('expenses.databaseHub.sortAlpha')}</span>
        </button>
      </div>

      <div className="tree-scroll-area">
        {treeData.length === 0 ? (
          <div className="tree-empty-state">{t('expenses.databaseHub.noExpensesFound')}</div>
        ) : (
          treeData.map(({ year, expenses }) => (
            <ExpenseDatabaseYearGroup
              key={year}
              year={year}
              expenses={expenses}
              isExpanded={expandedYears.has(year)}
              onToggle={onToggleYear}
              selectedExpenseId={selectedExpenseId}
              onSelectExpense={onSelectExpense}
            />
          ))
        )}
      </div>
    </div>
  );
}
