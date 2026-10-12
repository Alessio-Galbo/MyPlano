// Confirm modal for restoring an automatic snapshot.
import React from 'react';
import { ConfirmModal } from '../../components/ui';
import { useI18n } from '../../core/i18n';
import { formatDateTime } from '../../core/i18n/formatters';

export function AutoBackupConfirmModal({ pendingRestore, meta, onClose, onConfirm }) {
  const { t, language } = useI18n();
  const dateFormatted = meta?.createdAt ? formatDateTime(meta.createdAt, language) : '';
  const message = meta ? t('common.autoBackup.restoreConfirmMessage', {
    date: dateFormatted,
    profiles: meta.profiles,
    expenses: meta.expenses,
    documents: meta.documents,
  }) : '';

  return (
    <ConfirmModal
      isOpen={Boolean(pendingRestore)}
      onClose={onClose}
      onConfirm={onConfirm}
      title={t('common.autoBackup.restoreConfirmTitle')}
      message={message}
      confirmText={t('common.autoBackup.restoreButton')}
      variant="primary"
    />
  );
}
