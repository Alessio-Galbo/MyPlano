import React, { useState } from 'react';
import { useI18n, useFormatters } from '../../core/i18n';
import { getCategoryLabel } from '../expenses/expenseHelpers';
import { getCategoryColor, ensureCategoryClass } from '../../core/theme/dynamicThemeService';
import './CategoryPieChart.css';

export function CategoryPieChart({ categoryTotals = {}, totalAmount = 0 }) {
  const { t } = useI18n();
  const { formatCurrency, formatPercent } = useFormatters();
  const [hoveredCat, setHoveredCat] = useState(null);

  const formatCurr = (v) =>
    formatCurrency(v, { maximumFractionDigits: 0 });

  // Each slice starts where the previous ones end (offset computed up front, not during render).
  const slices = Object.entries(categoryTotals)
    .filter(([, c]) => c > 0)
    .sort((a, b) => b[1] - a[1])
    .reduce((acc, [cat, cost]) => {
      const start = acc.length ? acc[acc.length - 1].start + acc[acc.length - 1].percent : 0;
      const percent = totalAmount > 0 ? (cost / totalAmount) * 100 : 0;
      acc.push({ cat, cost, percent, start, color: getCategoryColor(cat), themeClass: ensureCategoryClass(cat) });
      return acc;
    }, []);

  return (
    <div className="donut-chart-container">
      <div className="donut-svg-wrapper">
        <svg viewBox="0 0 42 42" className="donut-svg">
          <circle className="donut-hole" cx="21" cy="21" r="15.9155" />
          <circle className="donut-ring" cx="21" cy="21" r="15.9155" />
          {slices.map((slice) => {
            const dashArray = `${slice.percent} ${100 - slice.percent}`;
            const dashOffset = 100 - slice.start + 25;
            const isHovered = hoveredCat === slice.cat;
            return (
              <circle
                key={slice.cat}
                className={`donut-segment ${isHovered ? 'hovered' : ''}`}
                cx="21"
                cy="21"
                r="15.9155"
                stroke={slice.color}
                strokeDasharray={dashArray}
                strokeDashoffset={dashOffset}
                onMouseEnter={() => setHoveredCat(slice.cat)}
                onMouseLeave={() => setHoveredCat(null)}
              />
            );
          })}
        </svg>
        <div className="donut-center-text">
          <span className="donut-center-label">
            {hoveredCat ? getCategoryLabel(hoveredCat, t) : t('budget.simulation.total')}
          </span>
          <span className="donut-center-value">
            {formatCurr(hoveredCat ? categoryTotals[hoveredCat] : totalAmount)}
          </span>
        </div>
      </div>

      <div className="donut-legend">
        {slices.map((slice) => (
          <div
            key={slice.cat}
            className={`donut-legend-item ${hoveredCat === slice.cat ? 'active' : ''}`}
            onMouseEnter={() => setHoveredCat(slice.cat)}
            onMouseLeave={() => setHoveredCat(null)}
          >
            <span className={`donut-legend-dot dynamic-color-dot ${slice.themeClass}`} />
            <span className="donut-legend-name">{getCategoryLabel(slice.cat, t)}</span>
            <span className="donut-legend-percent">{formatPercent(slice.percent)}</span>
            <span className="donut-legend-val">{formatCurr(slice.cost)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
