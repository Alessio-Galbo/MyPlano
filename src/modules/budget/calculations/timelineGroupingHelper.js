export function groupTimelineByCategory(timeline, categoryFilter) {
  if (!categoryFilter || categoryFilter === 'all') {
    return timeline.map((m) => ({
      ...m,
      isGroupedPeriod: false,
      key: `event-${m.monthNameKey}-${m.year}`,
    }));
  }

  const result = [];
  let idleBuffer = [];

  const flushIdle = () => {
    if (idleBuffer.length === 0) return;
    const first = idleBuffer[0];
    const last = idleBuffer[idleBuffer.length - 1];
    const count = idleBuffer.length;
    const quotaSum = idleBuffer.reduce((s, x) => s + x.quota, 0);
    const outflowSum = idleBuffer.reduce((s, x) => s + x.outflow, 0);

    result.push({
      isGroupedPeriod: true,
      key: `grp-${first.monthNameKey}-${first.year}-${last.monthNameKey}-${last.year}`,
      fromMonthLabel: `${first.monthNameKey} ${first.year}`,
      toMonthLabel: `${last.monthNameKey} ${last.year}`,
      monthsCount: count,
      quota: Math.round(quotaSum * 100) / 100,
      outflow: Math.round(outflowSum * 100) / 100,
      reserve: last.reserve,
      isShortage: last.isShortage,
      isSingleMonth: count === 1,
    });
    idleBuffer = [];
  };

  for (const m of timeline) {
    if (m.dueExpenses && m.dueExpenses.length > 0) {
      flushIdle();
      result.push({
        ...m,
        isGroupedPeriod: false,
        key: `event-${m.monthNameKey}-${m.year}`,
      });
    } else {
      idleBuffer.push(m);
    }
  }

  flushIdle();
  return result;
}
