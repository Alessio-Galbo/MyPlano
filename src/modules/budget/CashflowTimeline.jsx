import React from 'react';
import { usePersistentState } from '../../hooks/usePersistentState';
import { useI18n } from '../../core/i18n';
import { TimelineHorizonSelector } from './TimelineHorizonSelector';
import { TimelineCategoryPills } from './TimelineCategoryPills';
import { CategoryPieChart } from './CategoryPieChart';
import { CashflowTableRow } from './CashflowTableRow';
import { CashflowGroupedRow } from './CashflowGroupedRow';
import { useCashflowData } from './useCashflowData';
import './CashflowTimeline.css';

const isPlainObject = (v) => Boolean(v) && typeof v === 'object' && !Array.isArray(v);

export function CashflowTimeline({
  expenses,
  selectedProfileId,
  initialBalance = 0,
  simOptions = {},
}) {
  const { t } = useI18n();
  const [horizon, setHorizon] = usePersistentState('budget.horizon', 12, (v) => Number.isInteger(v) && v > 0 && v <= 120);
  const [categoryByProfile, setCategoryByProfile] = usePersistentState('budget.categoryByProfile', {}, isPlainObject);
  const selectedCategory = categoryByProfile[selectedProfileId] || 'all';
  const setSelectedCategory = (cat) => setCategoryByProfile((prev) => ({ ...prev, [selectedProfileId]: cat }));
  const [viewMode, setViewMode] = usePersistentState('budget.timelineView', 'timeline', (v) => v === 'timeline' || v === 'pie');

  const { categories, effectiveCategory, displayItems, horizonCatMap, horizonTotal } = useCashflowData(
    expenses, selectedProfileId, horizon, initialBalance, simOptions, selectedCategory,
  );

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
