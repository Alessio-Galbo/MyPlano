export function calculateDiscretionaryMargin(income, monthlyQuota) {
  return income > 0 ? Math.round((income - monthlyQuota) * 100) / 100 : 0;
}

export function performTopUpFund(profiles, targetId, amount, onUpdateBalance, onSelectStrategy) {
  const target = profiles.find((p) => p.id === targetId);
  if (target) {
    onUpdateBalance?.(targetId, Math.round(((target?.initialBalance || 0) + amount) * 100) / 100);
    onSelectStrategy?.('standard');
  }
}

export function performDepositProfileQuota(profiles, pId, amount, onDepositQuota, onUpdateBalance) {
  if (onDepositQuota) {
    onDepositQuota(pId, amount);
  } else {
    const target = profiles.find((p) => p.id === pId);
    onUpdateBalance?.(pId, Math.round(((Number(target?.initialBalance) || 0) + amount) * 100) / 100);
  }
}
