export const formatInnings = (outs) => {
  const full = Math.floor(outs / 3);
  const remainder = outs % 3;
  return remainder === 0 ? `${full}` : `${full}+${remainder}/3`;
};

export const calcERA = (earnedRuns, outs) => {
  if (!outs) return "0.00";
  return ((earnedRuns * 9) / (outs / 3)).toFixed(2);
};

export const calcK9 = (strikeouts, outs) => {
  if (!outs) return "0.00";
  return ((strikeouts * 9) / (outs / 3)).toFixed(2);
};

export const calcBB9 = (walks, outs) => {
  if (!outs) return "0.00";
  return ((walks * 9) / (outs / 3)).toFixed(2);
};

// -------------------- 野手系 --------------------
export const calcBattingAverage = (hits, atBats) => {
  if (!atBats) return ".000";
  const avg = hits / atBats;
  return avg.toFixed(3).startsWith("0") ? avg.toFixed(3).substring(1) : avg.toFixed(3);
};

export const calcOnBasePercentage = (hits, walks, atBats) => {
  const plateAppearances = atBats + walks;
  if (!plateAppearances) return ".000";
  const obp = (hits + walks) / plateAppearances;
  return obp.toFixed(3).startsWith("0") ? obp.toFixed(3).substring(1) : obp.toFixed(3);
};

export const calcStealPercentage = (steals, caught) => {
  if (!steals) return ".000";
  const sp = steals / (steals + caught);
  return sp.toFixed(3).startsWith("0") ? sp.toFixed(3).substring(1) : sp.toFixed(3);
};

export const calcSlugging = (singles, doubles, triples, homeRuns, atBats) => {
  if (!atBats) return ".000";
  const totalBases = singles + doubles * 2 + triples * 3 + homeRuns * 4;
  return (totalBases / atBats).toFixed(3);
};

export const calcOPS = (singles, doubles, triples, homeRuns, walks, atBats) => {
  const obp = parseFloat(calcOnBasePercentage(singles + doubles + triples + homeRuns, walks, atBats));
  const slg = parseFloat(calcSlugging(singles, doubles, triples, homeRuns, atBats));
  return (obp + slg).toFixed(3);
};
