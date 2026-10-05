// .ics export cases, loaded by test_notifications.mjs (not a standalone runner).
export async function run({ load, check, assert, exps, docs }) {
  const { buildIcsCalendar } = await load('modules/settings/icsCalendar.js');
  const labels = {
    'common.notifications.icsExpenseSummary': 'Pagamento: {title} ({amount})',
    'common.notifications.icsDocSummary': 'Scadenza documento: {title}',
    'common.notifications.icsDocAlarm': '{title} scade tra {days} giorni',
    'common.notifications.icsExpenseAlarm': 'Promemoria pagamento: {title} tra {days} giorni',
  };
  const t = (k) => labels[k] || k;
  const icsExps = [...exps,
    { id: 'eom', title: 'Affitto, casa; "lungo" titolo con àccenti è €€€ che supera abbondantemente i settantacinque ottetti',
      amount: 700, frequency: 'monthly', startDate: '2026-01-31', nextDueDate: '2026-10-31', excludedDates: ['2026-03-31'],
      installments: { '2026-02-15': { status: 'paid', isExtra: true } } },
    { id: 'leap', title: 'Bollo', amount: 90, frequency: 'annual', nextDueDate: '2028-02-29' },
    { id: 'bi', title: 'Bi', amount: 1, frequency: 'biennial', nextDueDate: '2027-05-10', enableAlert: false },
    { id: 'cd', title: 'CD', amount: 1, frequency: 'custom', customInterval: 10, customUnit: 'days', nextDueDate: '2026-10-10' },
    { id: 'nocal', title: 'NoCal', amount: 1, frequency: 'monthly', nextDueDate: '2026-10-10', includeInCalendar: false },
  ];
  const now = new Date(Date.UTC(2026, 9, 4, 8, 0, 0));
  const ics = buildIcsCalendar(docs, icsExps, t, now);
  const unfolded = ics.replace(/\r\n /g, '');
  const ev = (uid) => unfolded.split('BEGIN:VEVENT').find((b) => b.includes(`UID:${uid}@`)) || '';

  check('ics: CRLF only', () => assert.ok(ics.endsWith('\r\n') && !/[^\r]\n/.test(ics)));
  check('ics: lines folded at 75 octets', () => {
    for (const l of ics.split('\r\n')) assert.ok(Buffer.byteLength(l) <= 75, l);
  });
  check('ics: monthly RRULE + 3-day alarm when the expense has no alertDays', () => {
    assert.match(ev('exp-m1'), /DTSTART;VALUE=DATE:20260909\r\nRRULE:FREQ=MONTHLY;INTERVAL=1\r\n/);
    assert.match(ev('exp-m1'), /TRIGGER:-P3D/);
    assert.match(ev('exp-m1'), /DESCRIPTION:Promemoria pagamento: Luce tra 3 giorni/);
  });
  check('ics: expense alarm = its own alertDays, else 3 (global default ignored)', () => {
    const two = [{ id: 'a7', title: 'A7', amount: 1, frequency: 'monthly', nextDueDate: '2026-10-14', alertDays: 7 },
      { id: 'nd', title: 'ND', amount: 1, frequency: 'monthly', nextDueDate: '2026-10-14' }];
    const u = buildIcsCalendar([], two, t, now).replace(/\r\n /g, '');
    const e = (uid) => u.split('BEGIN:VEVENT').find((b) => b.includes(`UID:${uid}@`)) || '';
    assert.match(e('exp-a7'), /TRIGGER:-P7D/);
    assert.match(e('exp-nd'), /TRIGGER:-P3D/);
    assert.ok(!u.includes('TRIGGER:-P30D'));
  });
  check('ics: end of month clamp, EXDATE, RDATE, escaping', () => {
    assert.match(ev('exp-eom'), /RRULE:FREQ=MONTHLY;INTERVAL=1;BYMONTHDAY=28,29,30,31;BYSETPOS=-1/);
    assert.match(ev('exp-eom'), /EXDATE;VALUE=DATE:20260331/);
    assert.match(ev('exp-eom'), /RDATE;VALUE=DATE:20260215/);
    assert.match(ev('exp-eom'), /SUMMARY:Pagamento: Affitto\\, casa\\; "lungo"/);
  });
  check('ics: 29 Feb yearly', () => assert.match(ev('exp-leap'), /RRULE:FREQ=YEARLY;INTERVAL=1;BYMONTH=2;BYMONTHDAY=28,29;BYSETPOS=-1/));
  check('ics: biennial without alarm when alert off', () => {
    assert.match(ev('exp-bi'), /RRULE:FREQ=YEARLY;INTERVAL=2\r\n/);
    assert.ok(!ev('exp-bi').includes('VALARM'));
  });
  check('ics: custom days', () => assert.match(ev('exp-cd'), /RRULE:FREQ=DAILY;INTERVAL=10/));
  check('ics: UNTIL from endDate', () => assert.match(ev('exp-old'), /UNTIL=20260630/));
  check('ics: one-off without RRULE', () => {
    assert.ok(!ev('exp-off').includes('RRULE') && ev('exp-off').includes('DTSTART;VALUE=DATE:20261010'));
  });
  check('ics: includeInCalendar false / doc alert off excluded', () => {
    assert.ok(!unfolded.includes('UID:exp-nocal@') && !unfolded.includes('UID:doc-dno@'));
  });
  check('ics: document alarm = alertDays', () => {
    assert.match(ev('doc-d60'), /TRIGGER:-P60D/);
    assert.match(ev('doc-d30'), /TRIGGER:-P30D/);
  });
  check('ics: deterministic, balanced BEGIN/END', () => {
    assert.equal(buildIcsCalendar(docs, icsExps, t, now), ics);
    assert.equal((unfolded.match(/BEGIN:/g) || []).length, (unfolded.match(/END:/g) || []).length);
  });
}
