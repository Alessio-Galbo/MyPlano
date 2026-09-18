import React, { useState, useEffect } from 'react';
import { useI18n } from '../../core/i18n';
import { generateCashflowTimeline } from './budgetCalculations';
import { TimelineHorizonSelector } from './TimelineHorizonSelector';
import { TimelineCategoryPills } from './TimelineCategoryPills';
import { CategoryPieChart } from './CategoryPieChart';
import { CashflowTableRow } from './CashflowTableRow';
import { CashflowGroupedRow } from './CashflowGroupedRow';
import { groupTimelineByCategory } from './calculations/timelineGroupingHelper';
import { calculateHorizonTotals } from './calculations/horizonTotalsHelper';
import './CashflowTimeline.css';

export function CashflowTimeline({
  expenses,
  selectedProfileId,
  initialBalance = 0,
  simOptions = {},
}) {
  const { t } = useI18n();
  const [horizon, setHorizon] = useState(12);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [viewMode, setViewMode] = useState('timeline');

  useEffect(() => { setSelectedCategory('all'); }, [selectedProfileId]);

  const profileExpenses = selectedProfileId === 'all'
    ? expenses
    : expenses.filter((e) => e.profileId === selectedProfileId);

  const categories = Array.from(new Set(profileExpenses.map((e) => e.category).filter(Boolean)));
  const effectiveCategory = (selectedCategory === 'all' || categories.includes(selectedCategory)) ? selectedCategory : 'all';
  const effectiveSimOptions = { ...simOptions, categoryFilter: effectiveCategory };
  const timeline = generateCashflowTimeline(expenses, selectedProfileId, horizon, initialBalance, effectiveSimOptions);
  const displayItems = groupTimelineByCategory(timeline, effectiveCategory);
  const { catMap: horizonCatMap, total: horizonTotal } = calculateHorizonTotals(expenses, selectedProfileId, horizon);

  return (
    <div className="cashflow-container">
      <div className="cashflow-header">
        <div>
          <h3 className="cashflow-title">{t('budget.simulation.title')}</h3>
          <p className="cashflow-subtitle">{t('budget.simulation.subtitle')}</p>
        </div>
        <TimelineHorizonSelector horizon={horizon} onChange={setHorizon} />
      </div>

      <TimelineCategoryPills
        categories={categories}
        selectedCategory={effectiveCategory}
        onSelectCategory={setSelectedCategory}
        categoryTotals={horizonCatMap}
        totalAmount={horizonTotal}
        viewMode={viewMode}
        onToggleViewMode={() => setViewMode((prev) => (prev === 'timeline' ? 'pie' : 'timeline'))}
      />

      {viewMode === 'pie' ? (
        <CategoryPieChart categoryTotals={horizonCatMap} totalAmount={horizonTotal} />
      ) : (
        <div className="table-wrapper">
          <table className="cashflow-table">
            <thead>
              <tr>
                <th>{t('budget.simulation.month')}</th>
                <th><span className="th-desktop">{t('budget.metrics.monthlyQuota')}</span><span className="th-mobile">{t('budget.simulation.mobileQuota')}</span></th>
                <th><span className="th-desktop">{t('budget.simulation.outflow')}</span><span className="th-mobile">{t('budget.simulation.mobileOutflow')}</span></th>
                <th><span className="th-desktop">{t('budget.simulation.accumulated')}</span><span className="th-mobile">{t('budget.simulation.mobileReserve')}</span></th>
              </tr>
            </thead>
            <tbody>
              {displayItems.map((item, idx) => (
                item.isGroupedPeriod ? (
                  <CashflowGroupedRow key={item.key || idx} item={item} />
                ) : (
                  <CashflowTableRow key={item.key || idx} month={item} />
                )
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
