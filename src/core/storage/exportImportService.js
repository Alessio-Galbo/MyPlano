export function exportAllAppData(storage) {
  return JSON.stringify({
    version: 2,
    exportedAt: new Date().toISOString(),
    profiles: storage.getProfiles(),
    documents: storage.getDocuments(),
    expenses: storage.getExpenses(),
    initialBalance: storage.getInitialBalance(),
    monthlyIncome: storage.getMonthlyIncome(),
    profileFunds: storage.getProfileFunds(),
    profileFundConfigs: storage.getProfileFundConfigs(),
    profileIncomes: storage.getProfileIncomes(),
    profileIncomeConfigs: storage.getProfileIncomeConfigs(),
  }, null, 2);
}

export function importAllAppData(storage, jsonString) {
  try {
    const data = JSON.parse(jsonString);
    if (data.profiles) storage.saveProfiles(data.profiles);
    if (data.documents) storage.saveDocuments(data.documents);
    if (data.expenses) storage.saveExpenses(data.expenses);
    if (data.initialBalance !== undefined) storage.saveInitialBalance(data.initialBalance);
    if (data.monthlyIncome !== undefined) storage.saveMonthlyIncome(data.monthlyIncome);
    if (data.profileFunds) storage.saveProfileFunds(data.profileFunds);
    if (data.profileFundConfigs) storage.saveProfileFundConfigs(data.profileFundConfigs);
    if (data.profileIncomes) storage.saveProfileIncomes(data.profileIncomes);
    if (data.profileIncomeConfigs) storage.saveProfileIncomeConfigs(data.profileIncomeConfigs);
    return { success: true };
  } catch (err) {
    return { success: false, error: err.message };
  }
}
