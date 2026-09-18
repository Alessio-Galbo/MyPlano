import { profileFinanceStorage } from './profileFinanceStorage';

export function normalizeProfileFinances(profiles, defaultFund = 0, defaultIncome = 0) {
  const funds = profileFinanceStorage.getProfileFunds();
  const incomes = profileFinanceStorage.getProfileIncomes();

  return profiles.map((p, idx) => {
    let initialBalance = p.initialBalance !== undefined ? Number(p.initialBalance) : undefined;
    if (initialBalance === undefined) {
      initialBalance = funds[p.id] !== undefined ? Number(funds[p.id]) : (idx === 0 ? defaultFund : 0);
    }

    let monthlyIncome = p.monthlyIncome !== undefined ? Number(p.monthlyIncome) : undefined;
    if (monthlyIncome === undefined) {
      monthlyIncome = incomes[p.id] !== undefined ? Number(incomes[p.id]) : (idx === 0 ? defaultIncome : 0);
    }

    return {
      ...p,
      initialBalance: Math.round(initialBalance * 100) / 100,
      monthlyIncome: Math.round(monthlyIncome * 100) / 100,
    };
  });
}
