export function getSurvivalOptionDetails(analysis, worstMonthLabel, t, formatCurr) {
  const phases = analysis.phases || [];
  if (phases.length > 1) {
    const amountFormatted = `${formatCurr(phases[0].quota)} → ${formatCurr(phases[1].quota)}`;
    const desc = t('budget.coldStart.adaptiveMultiPhaseDesc')
      .replace('{firstQuota}', formatCurr(phases[0].quota))
      .replace('{firstMonth}', phases[0].monthLabel)
      .replace('{secondQuota}', formatCurr(phases[1].quota))
      .replace('{secondMonth}', phases[1].monthLabel);
    return { amountFormatted, desc };
  }

  return {
    amountFormatted: formatCurr(analysis.catchUpMonthlyQuota),
    desc: t('budget.coldStart.solutionTwoDesc')
      .replace('{amount}', formatCurr(analysis.catchUpMonthlyQuota))
      .replace('{month}', worstMonthLabel),
  };
}

export function getDeficitAlertTexts(analysis, worstMonthLabel, t, formatCurr) {
  const expensesSummary = analysis.worstMonth?.dueExpenses?.map((e) => e.title).join(', ') || '';
  const title = t('budget.coldStart.deficitTitle').replace('{month}', worstMonthLabel);
  const alert = t('budget.coldStart.deficitAlert')
    .replace('{month}', worstMonthLabel)
    .replace('{expenses}', expensesSummary || t('budget.simulation.outflow'))
    .replace('{amount}', formatCurr(analysis.maxDeficit));

  return { title, alert };
}
