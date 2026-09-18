export function computeAdaptiveSurvivalPhases(timeline, stdQuota, initialBalance = 0) {
  const n = timeline.length;
  const quotas = new Array(n).fill(stdQuota);
  const isSurvival = new Array(n).fill(false);
  let currentM = 0;
  let currentBal = initialBalance;
  const phases = [];

  while (currentM < n) {
    let maxRate = stdQuota;
    let hurdleM = -1;
    let cum = 0;

    for (let m = currentM + 1; m <= n; m++) {
      cum += timeline[m - 1].outflow;
      const count = m - currentM;
      const reqRate = (cum - currentBal) / count;
      if (reqRate > maxRate) {
        maxRate = reqRate;
        hurdleM = m;
      }
    }

    if (hurdleM === -1 || maxRate <= stdQuota + 0.01) {
      break;
    }

    const phaseRate = Math.ceil(maxRate * 100) / 100;
    const targetMonth = timeline[hurdleM - 1];
    phases.push({
      fromMonthIndex: currentM + 1,
      toMonthIndex: hurdleM,
      monthLabel: `${targetMonth.monthLongName || targetMonth.monthNameKey} ${targetMonth.year}`,
      quota: phaseRate,
    });

    for (let i = currentM; i < hurdleM; i++) {
      quotas[i] = phaseRate;
      isSurvival[i] = true;
      currentBal += (phaseRate - timeline[i].outflow);
    }
    currentM = hurdleM;
  }

  return { phases, quotas, isSurvival };
}
