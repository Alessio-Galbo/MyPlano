import React from 'react';
import { Tag, Lock, TrendingUp } from 'lucide-react';
import { useI18n } from '../../core/i18n';
import { ensureProfileClass, ensureCategoryClass } from '../../core/theme/dynamicThemeService';
import { getCategoryLabel } from './expenseHelpers';
import './ExpenseTags.css';

export function ExpenseTags({ profile, category, isVariable }) {
  const { t } = useI18n();
  const profileTheme = profile ? ensureProfileClass(profile.id) : '';
  const catTheme = ensureCategoryClass(category);

  return (
    <div className="expense-minimal-tags">
      {profile && (
        <span className={`tag-profile dynamic-tag ${profileTheme}`}>
          <span className={`dynamic-color-dot ${profileTheme}`} />
          {profile.name}
        </span>
      )}
      <span className={`tag-category dynamic-tag ${catTheme}`}>
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
