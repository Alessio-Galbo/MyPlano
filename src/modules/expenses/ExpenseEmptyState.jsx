import React from 'react';
import { useI18n } from '../../core/i18n';
import { EmptyStateCard } from '../../components/onboarding';

// Empty expense list: "add the first one" when the profile (or all profiles) has none,
// a plain hint when only the year/category filters hide them.
export function ExpenseEmptyState({ expenses, profiles, selectedProfileId, onCreate }) {
  const { t } = useI18n();
  const isAll = selectedProfileId === 'all';
  const hasAny = expenses.some((e) => isAll || e.profileId === selectedProfileId);

  if (hasAny) return <EmptyStateCard message={t('expenses.empty.filtered')} />;

  const name = profiles.find((p) => p.id === selectedProfileId)?.name || '';
  return (
    <EmptyStateCard
      title={t('expenses.empty.title')}
      message={isAll ? t('expenses.empty.all') : t('expenses.empty.profile', { name })}
      actionLabel={t('expenses.empty.action')}
      onAction={onCreate}
    />
  );
}
