// Pure .ics builder (no i18n import, testable in node). `t` is the translate function.
import { escapeText, icsDate, icsTimestamp, joinLines, expenseRecurrence } from './icsFormat';

export const EXPENSE_ALARM_DAYS = 3;
const DEFAULT_DOC_ALERT_DAYS = 30;

const fill = (text, values) => Object.entries(values)
  .reduce((s, [k, v]) => s.replace(`{${k}}`, v), text);

function alarm(days, description) {
  return [
    'BEGIN:VALARM', 'ACTION:DISPLAY', `TRIGGER:-P${days}D`,
    `DESCRIPTION:${escapeText(description)}`, 'END:VALARM',
  ];
}

function documentEvent(doc, t, stamp) {
  const days = Math.floor(Number(doc.alertDays)) > 0 ? Math.floor(Number(doc.alertDays)) : DEFAULT_DOC_ALERT_DAYS;
  const description = [
    `${t('documents.fields.identifier')}: ${doc.identifier || '-'}`,
    `${t('documents.fields.issuer')}: ${doc.issuer || '-'}`,
  ].join('\n');
  return [
    'BEGIN:VEVENT', `UID:doc-${doc.id}@myplano.app`, `DTSTAMP:${stamp}`,
    `DTSTART;VALUE=DATE:${icsDate(doc.expiryDate)}`,
    `SUMMARY:${escapeText(fill(t('common.notifications.icsDocSummary'), { title: doc.title }))}`,
    `DESCRIPTION:${escapeText(description)}`, 'TRANSP:TRANSPARENT',
    ...alarm(days, fill(t('common.notifications.icsDocAlarm'), { title: doc.title, days })),
    'END:VEVENT',
  ];
}

function expenseEvent(exp, t, stamp) {
  const amount = `${Number(exp.amount || 0).toFixed(2)} €`;
  const { dtstart, lines } = expenseRecurrence(exp);
  if (!dtstart) return [];
  const description = [
    `${t('expenses.fields.amount')}: ${amount}`,
    t(`expenses.frequencies.${exp.frequency || 'oneOff'}`),
  ].join('\n');
  const alarmLines = exp.enableAlert === false ? [] : alarm(EXPENSE_ALARM_DAYS,
    fill(t('common.notifications.icsExpenseAlarm'), { title: exp.title, days: EXPENSE_ALARM_DAYS }));
  return [
    'BEGIN:VEVENT', `UID:exp-${exp.id}@myplano.app`, `DTSTAMP:${stamp}`,
    `DTSTART;VALUE=DATE:${icsDate(dtstart)}`, ...lines,
    `SUMMARY:${escapeText(fill(t('common.notifications.icsExpenseSummary'), { title: exp.title, amount }))}`,
    `DESCRIPTION:${escapeText(description)}`, 'TRANSP:TRANSPARENT',
    ...alarmLines, 'END:VEVENT',
  ];
}

// Documents with the reminder on (alarm `alertDays` before), expenses with includeInCalendar !== false:
// one recurring event per expense (RRULE), alarm 3 days before when its alert is on.
export function buildIcsCalendar(documents = [], expenses = [], t = (k) => k, now = new Date()) {
  const stamp = icsTimestamp(now);
  const events = [
    ...documents.filter((d) => d?.id && d.expiryDate && d.enableAlert !== false)
      .map((d) => documentEvent(d, t, stamp)),
    ...expenses.filter((e) => e?.id && e.includeInCalendar !== false && (e.nextDueDate || e.startDate))
      .map((e) => expenseEvent(e, t, stamp)),
  ];
  return joinLines([
    'BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//MyPlano//MyPlano//IT',
    'CALSCALE:GREGORIAN', 'METHOD:PUBLISH', 'X-WR-CALNAME:MyPlano',
    ...events.flat(), 'END:VCALENDAR',
  ]);
}
