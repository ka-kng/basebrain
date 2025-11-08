// 数値入力項目の設定（ラベル・単位など 打者）
export const BatterNumberFields = [
  { key: "at_bats", label: "打数", unit: "打数", note: "※打数には四死球を含みません" },
  { key: "hits", label: "一塁打", unit: "本" },
  { key: "doubles", label: "二塁打", unit: "本" },
  { key: "triples", label: "三塁打", unit: "本" },
  { key: "home_runs", label: "本塁打", unit: "本" },
  { key: "rbis", label: "打点", unit: "点" },
  { key: "runs", label: "得点", unit: "点" },
  { key: "walks", label: "四死球", unit: "回" },
  { key: "strikeouts", label: "三振", unit: "回" },
  { key: "steals", label: "盗塁数", unit: "回" },
  { key: "caught_stealing", label: "盗塁成功", unit: "回" },
  { key: "errors", label: "失策", unit: "回" },
];

// 数値入力項目の設定（ラベル・単位など 投手）
export const PitcherNumberFields = [
  { key: "pitches", label: "投球数", unit: "球" },
  { key: "strikeouts", label: "奪三振", unit: "回" },
  { key: "hits_allowed", label: "被安打", unit: "本" },
  { key: "hr_allowed", label: "被本塁打", unit: "本" },
  { key: "walks_given", label: "四死球", unit: "回" },
  { key: "runs_allowed", label: "失点", unit: "点" },
  { key: "earned_runs", label: "自責点", unit: "点" },
];
