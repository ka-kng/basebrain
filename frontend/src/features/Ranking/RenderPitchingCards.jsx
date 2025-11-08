export default function RenderPitchingCards({ pitchingRecords }) {
  const metrics = [
    { key: "era", label: "防御率" },
    { key: "wins", label: "勝利数" },
    { key: "strikeouts", label: "奪三振数" },
  ];

  // 指標ごとにカードを作成
  return metrics.map(metric => {
    const topPlayers = pitchingRecords[metric.key] || [];
    return (
      <div key={metric.key} className="bg-white shadow-md rounded-xl p-4 mb-4">
        {/* 指標名 */}
        <h3 className="text-lg font-bold mb-2">{metric.label}</h3>

        <ul>
          {/* 上位プレイヤーをリスト表示 */}
          {topPlayers.map((player, index) => (

            <li key={player.user_id} className="flex justify-between py-2 border-b last:border-b-0">

              {/* ランキング順位と名前 */}
              <span>{index + 1}. {player.name}</span>

              {/* 値を表示（防御率のみ小数2桁） */}
              <span className="font-mono">
                {metric.key === "era" ? player[metric.key].toFixed(2) : player[metric.key]}
              </span>

            </li>
          ))}

        </ul>
      </div>
    );
  });
}
