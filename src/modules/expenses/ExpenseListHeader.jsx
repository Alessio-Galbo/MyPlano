import React from 'react';
import { Plus, List, Layers } from 'lucide-react';
import { Button } from '../../components/ui';
import { useI18n } from '../../core/i18n';
import './ExpenseListHeader.css';

export function ExpenseListHeader({ viewMode, onToggleViewMode, onCreate, disabled = false }) {
  const { t } = useI18n();
  const reason = disabled ? t('common.onboarding.needProfile') : undefined;

  return (
    <div className="section-header expense-section-header">
      <div>
        <h2>{t('expenses.title')}</h2>
        <p className="text-subtle">{t('expenses.subtitle')}</p>
      </div>

      <div className="expense-header-actions">
        <div className="view-mode-toggle">
          <button
            type="button"
            className={`view-mode-btn ${viewMode === 'list' ? 'active' : ''}`}
            onClick={() => onToggleViewMode('list')}
            title={t('expenses.viewMode.list')}
          >
            <List size={15} />
            <span>{t('expenses.viewMode.list')}</span>
          </button>
          <button
            type="button"
            className={`view-mode-btn ${viewMode === 'grouped' ? 'active' : ''}`}
            onClick={() => onToggleViewMode('grouped')}
            title={t('expenses.viewMode.grouped')}
          >
            <Layers size={15} />
            <span>{t('expenses.viewMode.grouped')}</span>
          </button>
        </div>

        <Button
          icon={<Plus size={16} />} onClick={onCreate} className="expense-create-btn"
          disabled={disabled} title={reason} aria-label={reason && `${t('expenses.addExpense')}: ${reason}`}
        >
          <span>{t('expenses.addExpense')}</span>
        </Button>
      </div>
    </div>
  );
}
