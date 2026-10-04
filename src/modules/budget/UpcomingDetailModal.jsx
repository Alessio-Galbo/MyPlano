import React from 'react';
import { Receipt, FileText } from 'lucide-react';
import { Modal, Button } from '../../components/ui';
import { useI18n } from '../../core/i18n';
import { formatCurrency } from '../expenses/expenseHelpers';
import { getUpcomingDaysLabel } from './upcomingDaysLabel';
import './UpcomingDetailModal.css';

export function UpcomingDetailModal({ item, isOpen, onClose }) {
  const { t } = useI18n();
  if (!item || !isOpen) return null;

  const isExpense = item.itemType === 'expense';
  const raw = item.raw || {};

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={t('budget.metrics.viewDetails')} maxWidth="440px">
      <div className="upcoming-detail-modal-body">
        <div className="upcoming-detail-header-card">
          <div className="upcoming-detail-icon">
            {isExpense ? <Receipt size={20} /> : <FileText size={20} />}
          </div>
          <div className="upcoming-detail-title-group">
            <h3 className="upcoming-detail-title">{item.title}</h3>
            <span className="upcoming-detail-type-badge">
              {isExpense ? `${t('common.nav.expenses')} • ${t(`expenses.frequencies.${raw.frequency || 'annual'}`)}` : (raw.type || t('common.nav.documents'))}
            </span>
          </div>
        </div>

        <div className="upcoming-detail-grid">
          <div className="upcoming-detail-cell">
            <span className="upcoming-detail-label">{t('expenses.fields.dueDate')}</span>
            <span className="upcoming-detail-val">{item.date}</span>
          </div>

          <div className="upcoming-detail-cell">
            <span className="upcoming-detail-label">
              {isExpense ? t('expenses.fields.amount') : t('documents.fields.identifier')}
            </span>
            <span className="upcoming-detail-val">
              {isExpense ? formatCurrency(item.amount) : (raw.identifier || '—')}
            </span>
          </div>

          <div className="upcoming-detail-cell">
            <span className="upcoming-detail-label">{t('budget.metrics.upcomingDeadlines')}</span>
            <span className={`upcoming-detail-val ${item.isOverdue ? 'is-overdue-text' : 'text-gradient'}`}>
              {getUpcomingDaysLabel(t, item)}
            </span>
          </div>

          <div className="upcoming-detail-cell">
            <span className="upcoming-detail-label">
              {isExpense ? t('expenses.fields.category') : t('documents.fields.issuer')}
            </span>
            <span className="upcoming-detail-val">
              {isExpense ? (raw.category || '—') : (raw.issuer || '—')}
            </span>
          </div>
        </div>

        {raw.notes && (
          <div className="upcoming-detail-notes">
            <span className="upcoming-detail-label">{t('expenses.fields.notes')}</span>
            <p className="upcoming-detail-notes-text">{raw.notes}</p>
          </div>
        )}

        <div className="upcoming-detail-actions">
          <Button type="button" variant="secondary" onClick={onClose}>
            {t('common.actions.close')}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
