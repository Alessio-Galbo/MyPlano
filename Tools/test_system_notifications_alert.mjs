// Per-expense notice (`alertDays`) in the system-notification mirror and summary, loaded by test_system_notifications.mjs.
export function run({ buildMirror, summarize, mirror, texts, today, check, assert }) {
  check('mirror: expense notice = alertDays, else the default (changed)', () => {
    const e = [{ id: 'a7', title: 'A7', amount: 1, frequency: 'oneOff', nextDueDate: '2026-10-14', alertDays: 7 },
      { id: 'a5', title: 'A5', amount: 1, frequency: 'oneOff', nextDueDate: '2026-10-09', alertDays: 7 },
      { id: 'nd', title: 'ND', amount: 1, frequency: 'oneOff', nextDueDate: '2026-10-20' }];
    const m = buildMirror({ expenses: e, enabled: true, texts, today, expenseAlertDays: 20 });
    assert.equal(m.items.find((i) => i.id === 'exp-a5@2026-10-09').soon, 7);
    assert.equal(m.items.find((i) => i.id === 'exp-nd@2026-10-20').soon, 20);
    assert.equal(mirror.items.find((i) => i.id === 'exp-aff@2026-10-04').soon, 30);
    // Due in 10 days with a 7-day notice: no "soon" summary today, it arrives 7 days before.
    const only7 = { ...m, items: m.items.filter((i) => i.id.startsWith('exp-a7')) };
    assert.equal(only7.items.length, 1, 'kept in the mirror for later days');
    assert.equal(summarize(only7, {}, today), null);
    assert.equal(summarize(only7, {}, '2026-10-07').body, 'A7 tra 7 gg');
  });
}
