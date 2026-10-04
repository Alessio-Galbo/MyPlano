import { useRef, useEffect, useCallback } from 'react';
import { useToast } from '../../components/ui';
import { useI18n } from '../../core/i18n';

// Deletes a document (already confirmed by the user) and offers "Undo" in a toast.
// Undo saves the removed document back (useAppData.saveDocument is an upsert).
export function useDocumentDeleteWithUndo({ documents, onDeleteDocument, onSaveDocument }) {
  const { t } = useI18n();
  const toast = useToast();
  const saveRef = useRef(onSaveDocument);
  useEffect(() => { saveRef.current = onSaveDocument; }, [onSaveDocument]);

  return useCallback((id) => {
    const removed = documents.find((d) => d.id === id);
    onDeleteDocument(id);
    if (!removed) return;
    toast.show({
      message: t('common.toast.documentDeleted').replace('{title}', removed.title || ''),
      variant: 'success',
      action: {
        label: t('common.toast.undo'),
        onClick: () => {
          saveRef.current(removed);
          toast.show({ message: t('common.toast.restored'), variant: 'info' });
        },
      },
    });
  }, [documents, onDeleteDocument, toast, t]);
}
