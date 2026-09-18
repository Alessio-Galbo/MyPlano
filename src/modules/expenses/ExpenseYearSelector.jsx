import React, { useState } from 'react';
import { Calendar, SlidersHorizontal } from 'lucide-react';
import { useI18n } from '../../core/i18n';
import './ExpenseYearSelector.css';

export function ExpenseYearSelector({
  selectedRange,
  onSelectRange,
  availableYears = [2026, 2027, 2028, 2029, 2030],
}) {
  const { t } = useI18n();
  const [showRangeInputs, setShowRangeInputs] = useState(selectedRange.mode === 'range');

  const handleSelectSingleYear = (year) => {
    setShowRangeInputs(false);
    onSelectRange({ mode: 'single', fromYear: year, toYear: year });
  };

  const handleSelectAll = () => {
    setShowRangeInputs(false);
    onSelectRange({ mode: 'all', fromYear: availableYears[0], toYear: availableYears[availableYears.length - 1] });
  };

  const handleToggleRange = () => {
    const next = !showRangeInputs;
    setShowRangeInputs(next);
    if (next) onSelectRange({ mode: 'range', fromYear: selectedRange.fromYear, toYear: selectedRange.toYear });
  };

  const handleRangeChange = (key, val) => {
    const num = Number(val);
    const fromYear = key === 'from' ? num : selectedRange.fromYear;
    const toYear = Math.max(fromYear, key === 'to' ? num : selectedRange.toYear);
    onSelectRange({ mode: 'range', fromYear, toYear });
  };

  return (
    <div className="expense-year-selector-bar">
      <div className="year-selector-left">
        <span className="year-selector-label"><Calendar size={14} /><span>{t('expenses.yearFilter.yearLabel')}</span></span>
        <div className="year-pills-row">
          {availableYears.map((year) => (
            <button
              key={year} type="button"
              className={`year-pill ${selectedRange.mode === 'single' && selectedRange.fromYear === year ? 'active' : ''}`}
              onClick={() => handleSelectSingleYear(year)}
            >{year}</button>
          ))}
          <button type="button" className={`year-pill ${selectedRange.mode === 'all' ? 'active' : ''}`} onClick={handleSelectAll}>
            {t('expenses.yearFilter.allYears')}
          </button>
          <button
            type="button" className={`year-pill year-range-toggle-btn ${selectedRange.mode === 'range' ? 'active' : ''}`}
            onClick={handleToggleRange} title={t('expenses.yearFilter.range')}
          >
            <SlidersHorizontal size={12} /><span>{t('expenses.yearFilter.range')}</span>
          </button>
        </div>
      </div>

      {showRangeInputs && (
        <div className="year-range-inputs-row">
          <span className="range-label">{t('expenses.yearFilter.from')}</span>
          <select className="year-range-select" value={selectedRange.fromYear} onChange={(e) => handleRangeChange('from', e.target.value)}>
            {availableYears.map((y) => <option key={`from-${y}`} value={y}>{y}</option>)}
          </select>
          <span className="range-label">{t('expenses.yearFilter.to')}</span>
          <select className="year-range-select" value={selectedRange.toYear} onChange={(e) => handleRangeChange('to', e.target.value)}>
            {availableYears.filter((y) => y >= selectedRange.fromYear).map((y) => <option key={`to-${y}`} value={y}>{y}</option>)}
          </select>
        </div>
      )}
    </div>
  );
}

