import { useState, useEffect, useCallback } from 'react';
import { getUpcomingDeadlines } from '../../modules/budget/budgetCalculations';
import {
  getDismissedNotificationIds,
  dismissNotificationId,
  restoreAllDismissedNotifications,
} from '../../core/storage/notificationStorage';

export function useNotifications(expenses = [], documents = [], selectedProfileId = 'all') {
  const [dismissedIds, setDismissedIds] = useState([]);

  useEffect(() => {
    setDismissedIds(getDismissedNotificationIds());
  }, []);

  const allUpcoming = getUpcomingDeadlines(expenses, documents, selectedProfileId);
  const activeList = allUpcoming.filter((item) => !dismissedIds.includes(item.id));
  const count = activeList.length;
  const dismissedCount = dismissedIds.length;

  const dismissItem = useCallback((id) => {
    dismissNotificationId(id);
    setDismissedIds(getDismissedNotificationIds());
  }, []);

  const restoreAll = useCallback(() => {
    restoreAllDismissedNotifications();
    setDismissedIds([]);
  }, []);

  return {
    allUpcoming,
    activeList,
    count,
    dismissedCount,
    dismissItem,
    restoreAll,
  };
}
