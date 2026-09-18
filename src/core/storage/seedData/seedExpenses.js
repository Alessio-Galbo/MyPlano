import { SEED_PERSONAL_EXPENSES } from './seedPersonalExpenses';
import { SEED_HOME_EXPENSES } from './seedHomeExpenses';
import { SEED_WORK_EXPENSES } from './seedWorkExpenses';

export const INITIAL_EXPENSES = [
  ...SEED_PERSONAL_EXPENSES,
  ...SEED_HOME_EXPENSES,
  ...SEED_WORK_EXPENSES,
];
