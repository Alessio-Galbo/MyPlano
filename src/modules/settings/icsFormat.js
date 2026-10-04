// RFC 5545 helpers: text escaping, 75-octet line folding, DATE values, recurrence rules.
import { getExpenseOrigin, getExpenseStep, getGridDates, isOccurrenceActive } from '../../core/dates/recurrence';

const encoder = new TextEncoder();

export function escapeText(value) {
  return String(value ?? '')
    .replace(/\\/g, '\\\\').replace(/;/g, '\\;').replace(/,/g, '\\,')
    .replace(/\r?\n/g, '\\n');
}

export const icsDate = (iso) => String(iso).slice(0, 10).replace(/-/g, '');

export function icsTimestamp(date = new Date()) {
  return `${date.toISOString().replace(/[-:]/g, '').split('.')[0]}Z`;
}

// Folds a content line at 75 octets (UTF-8), never splitting a multi-byte character.
export function foldLine(line) {
  if (encoder.encode(line).length <= 75) return line;
  const parts = [];
  let current = '';
  let size = 0;
  let limit = 75;
  for (const ch of line) {
    const len = encoder.encode(ch).length;
    if (size + len > limit) {
      parts.push(current);
      current = '';
      size = 0;
      limit = 74; // continuation lines start with one space
    }
    current += ch;
    size += len;
  }
  parts.push(current);
  return parts.join('\r\n ');
}

export const joinLines = (lines) => `${lines.map(foldLine).join('\r\n')}\r\n`;

// Monthly series on day 29-31 clamp to the month's end like the app does (31 Jan -> 28 Feb).
function clampRule(origin, months) {
  const [, m, d] = origin.split('-').map(Number);
  if (months % 12 === 0) {
    return m === 2 && d === 29 ? ';BYMONTH=2;BYMONTHDAY=28,29;BYSETPOS=-1' : '';
  }
  if (d < 29) return '';
  const days = [];
  for (let x = 28; x <= d; x++) days.push(x);
  return `;BYMONTHDAY=${days.join(',')};BYSETPOS=-1`;
}

// { dtstart, lines[] } for an expense: RRULE (+ UNTIL, EXDATE, RDATE for extra installments).
export function expenseRecurrence(expense) {
  const origin = getExpenseOrigin(expense);
  const step = getExpenseStep(expense);
  if (!origin || !step) return { dtstart: expense.nextDueDate || origin, lines: [] };

  let rule;
  if (step.unit === 'days') rule = `FREQ=DAILY;INTERVAL=${step.n}`;
  else if (step.n % 12 === 0) rule = `FREQ=YEARLY;INTERVAL=${step.n / 12}`;
  else rule = `FREQ=MONTHLY;INTERVAL=${step.n}`;
  if (step.unit === 'months') rule += clampRule(origin, step.n);
  if (expense.endDate) rule += `;UNTIL=${icsDate(expense.endDate)}`;

  const lines = [`RRULE:${rule}`];
  const exdates = (expense.excludedDates || []).filter((d) => d >= origin && getGridDates(origin, step, d, d).length);
  if (exdates.length) lines.push(`EXDATE;VALUE=DATE:${exdates.map(icsDate).join(',')}`);
  const extras = Object.keys(expense.installments || {})
    .filter((d) => /^\d{4}-\d{2}-\d{2}$/.test(d) && isOccurrenceActive(expense, d))
    .filter((d) => d < origin || !getGridDates(origin, step, d, d).length);
  if (extras.length) lines.push(`RDATE;VALUE=DATE:${extras.sort().map(icsDate).join(',')}`);
  return { dtstart: origin, lines };
}
