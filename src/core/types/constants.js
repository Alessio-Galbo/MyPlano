export const FREQUENCY_MULTIPLIERS = {
  monthly: 12,
  bimonthly: 6,
  quarterly: 4,
  semiannual: 2,
  annual: 1,
  biennial: 0.5,
  custom: 1,
  oneOff: 1,
};

export const DOCUMENT_TYPES = [
  'idCard',
  'drivingLicense',
  'passport',
  'healthCard',
  'bankCard',
  'subscription',
  'other',
];

export const EXPENSE_CATEGORIES = [
  'utilities',
  'vehicle',
  'home',
  'taxes',
  'subscriptions',
  'health',
  'other',
];

export const ALERT_THRESHOLDS = {
  WARNING_DAYS: 60,
  CRITICAL_DAYS: 15,
};
