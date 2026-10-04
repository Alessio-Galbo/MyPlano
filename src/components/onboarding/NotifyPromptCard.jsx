import React, { useState } from 'react';
import { usePersistentState } from '../../hooks/usePersistentState';
import { isNotificationSupported, getPermission, PREF_NAME } from '../../core/notifications';
import { UI_PREFIX } from '../../core/storage/storageKeys';
import { NotifyPromptBody } from './NotifyPromptBody';

// Asked once: null → shown; 'enabled' | 'later' → never again. Skipped when the browser has
// no notifications, the permission is blocked, or device notifications are already on.
export function NotifyPromptCard() {
  const [answer, setAnswer] = usePersistentState('notifyPrompt', null);
  const [show] = useState(() => {
    if (!isNotificationSupported() || getPermission() === 'denied') return false;
    try {
      return localStorage.getItem(UI_PREFIX + PREF_NAME) !== 'true';
    } catch {
      return true;
    }
  });
  if (answer || !show) return null;
  return <NotifyPromptBody onDone={setAnswer} />;
}
