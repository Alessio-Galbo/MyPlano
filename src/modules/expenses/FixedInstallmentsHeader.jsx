import React from 'react';
import { ArrowDown10, ArrowUp01, Eye, EyeOff, Plus } from 'lucide-react';

export function FixedInstallmentsHeader({
  datesCount,
  showExtra,
  onShowExtra,
  hidePastInstallments,
  onToggleHidePastInstallments,
  installmentSort,
  onToggleInstallmentSort,
  t,
}) {
  return (
    <div className="fixed-installments-header">
      <div className="installments-title-group">
        <h5 className="fixed-installments-title">
          {t('expenses.history.installmentsList')} ({datesCount})
        </h5>
        {!showExtra && (
          <button
            type="button"
            className="fixed-extra-add-btn"
            onClick={onShowExtra}
            title={t('expenses.history.addExtraCompact')}
          >
            <Plus size={14} />
            <span className="extra-btn-label">{t('expenses.history.addExtraCompact')}</span>
          </button>
        )}
      </div>

      <div className="installments-actions-group">
        <button
          type="button"
          className={`installment-sort-btn icon-only ${hidePastInstallments ? 'active' : ''}`}
          onClick={onToggleHidePastInstallments}
          title={hidePastInstallments ? t('expenses.databaseHub.showPastInstallments') : t('expenses.databaseHub.hidePastInstallments')}
        >
          {hidePastInstallments ? <EyeOff size={13} /> : <Eye size={13} />}
        </button>
        <button
          type="button"
          className="installment-sort-btn"
          onClick={onToggleInstallmentSort}
          title={installmentSort === 'desc' ? t('expenses.databaseHub.sortInstallmentsDesc') : t('expenses.databaseHub.sortInstallmentsAsc')}
        >
          {installmentSort === 'desc' ? <ArrowDown10 size={13} /> : <ArrowUp01 size={13} />}
          <span>{installmentSort === 'desc' ? t('expenses.databaseHub.sortRecent') : t('expenses.databaseHub.sortOld')}</span>
        </button>
      </div>
    </div>
  );
}
