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
  const firstMonth = analysis.firstDeficitMonth;
  const firstMonthLabel = firstMonth
    ? `${firstMonth.monthLongName || firstMonth.monthNameKey} ${firstMonth.year}`
    : worstMonthLabel;

  const isProgressive = firstMonthLabel && worstMonthLabel && firstMonthLabel !== worstMonthLabel;
  const amountFormatted = formatCurr(analysis.maxDeficit);
  const expensesFormatted = expensesSummary || t('budget.simulation.outflow');

  if (isProgressive) {
    const title = t('budget.coldStart.deficitTitleProgressive')
      .replace('{firstMonth}', firstMonthLabel)
      .replace('{worstMonth}', worstMonthLabel);

    const rawTemplate = t('budget.coldStart.deficitAlertProgressive');
    const replacements = {
      '{firstMonth}': firstMonthLabel,
      '{worstMonth}': worstMonthLabel,
      '{expenses}': expensesFormatted,
      '{amount}': amountFormatted,
    };
    const alert = rawTemplate
      .replace('{firstMonth}', firstMonthLabel)
      .replace('{worstMonth}', worstMonthLabel)
      .replace('{expenses}', expensesFormatted)
      .replace('{amount}', amountFormatted);

    return { title, alert, rawTemplate, replacements };
  }

  const title = t('budget.coldStart.deficitTitle').replace('{month}', worstMonthLabel);
  const rawTemplate = t('budget.coldStart.deficitAlert');
  const replacements = {
    '{month}': worstMonthLabel,
    '{expenses}': expensesFormatted,
    '{amount}': amountFormatted,
  };
  const alert = rawTemplate
    .replace('{month}', worstMonthLabel)
    .replace('{expenses}', expensesFormatted)
    .replace('{amount}', amountFormatted);

  return { title, alert, rawTemplate, replacements };
}

export function getPlanBPhaseItems(analysis, worstMonthLabel, t, formatCurr) {
  const phases = analysis.phases || [];
  if (phases.length > 0) {
    const items = phases.map((phase) =>
      t('budget.coldStart.planBPhaseItem')
        .replace('{quota}', formatCurr(phase.quota))
        .replace('{month}', phase.monthLabel)
    );
    items.push(t('budget.coldStart.planBReactivateStandard'));
    return items;
  }
  return [
    t('budget.coldStart.planBPhaseItem')
      .replace('{quota}', formatCurr(analysis.catchUpMonthlyQuota))
      .replace('{month}', worstMonthLabel),
    t('budget.coldStart.planBReactivateStandard'),
  ];
}
