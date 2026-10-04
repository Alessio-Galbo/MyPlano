import { useRef, useEffect, useCallback } from 'react';
import { useToast } from '../../components/ui';
import { useI18n } from '../../core/i18n';

// Deletes a profile (already confirmed in DeleteProfileModal) with its expenses,
// documents and finance, then offers "Undo" in a toast that restores all of it.
export function useProfileDeleteWithUndo({ deleteProfile, restoreProfileBundle }) {
  const { t } = useI18n();
  const toast = useToast();
  const restoreRef = useRef(restoreProfileBundle);
  useEffect(() => { restoreRef.current = restoreProfileBundle; }, [restoreProfileBundle]);

  return useCallback((profileId) => {
    // "1 documento" / "3 documenti": singular and plural keys (...One / ...Many).
    const countText = (base, n) => t(`common.profiles.${base}${n === 1 ? 'One' : 'Many'}`, { n });
    const snapshot = deleteProfile(profileId);
    if (!snapshot) return;
    const name = snapshot.profile.name || '';
    toast.show({
      message: t('common.profiles.deletedToast', {
        name,
        expenses: countText('expensesCount', snapshot.expenses.length),
        documents: countText('documentsCount', snapshot.documents.length),
      }),
      variant: 'success',
      action: {
        label: t('common.toast.undo'),
        onClick: () => {
          restoreRef.current(snapshot);
          toast.show({ message: t('common.profiles.restoredToast', { name }), variant: 'info' });
        },
      },
    });
  }, [deleteProfile, toast, t]);
}
