import React from 'react';
import { useI18n } from '../../core/i18n';
import { EmptyStateCard } from '../../components/onboarding';

// Empty document list: different text for "All profiles" and a single profile.
export function DocumentEmptyState({ profiles, selectedProfileId, onCreate }) {
  const { t } = useI18n();
  const isAll = selectedProfileId === 'all';
  const name = profiles.find((p) => p.id === selectedProfileId)?.name || '';
  return (
    <EmptyStateCard
      title={t('documents.empty.title')}
      message={isAll ? t('documents.empty.all') : t('documents.empty.profile', { name })}
      actionLabel={t('documents.empty.action')}
      onAction={onCreate}
    />
  );
}
