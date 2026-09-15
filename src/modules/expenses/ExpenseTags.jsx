import React from 'react';
import { Tag, Lock, TrendingUp } from 'lucide-react';
import { useI18n } from '../../core/i18n';
import { getCategoryLabel } from './expenseHelpers';
import './ExpenseTags.css';

export function ExpenseTags({ profile, category, isVariable }) {
  const { t } = useI18n();

  return (
    <div className="expense-minimal-tags">
      {profile && (
        <span className={`tag-profile tag-profile-${profile.id}`}>
          <span className={`profile-color-dot dot-${profile.id}`} />
          {profile.name}
        </span>
      )}
      <span className="tag-category">
        <Tag size={11} className="tag-icon" />
        {getCategoryLabel(category, t)}
      </span>
      <span className={`tag-type ${isVariable ? 'type-var' : 'type-fixed'}`}>
        {isVariable ? (
          <>
            <TrendingUp size={11} className="tag-icon" />
            {t('expenses.tags.variable')}
          </>
        ) : (
          <>
            <Lock size={11} className="tag-icon" />
            {t('expenses.tags.fixed')}
          </>
        )}
      </span>
    </div>
  );
}
