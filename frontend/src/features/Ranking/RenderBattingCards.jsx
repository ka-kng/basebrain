export default function RenderBattingCards({ battingRecords }) {
  const metrics = [
    { key: "avg", label: "打率" },
    { key: "obp", label: "出塁率" },
    { key: "hits", label: "安打" },
    { key: "home_runs", label: "本塁打" },
    { key: "rbis", label: "打点" },
    { key: "caught_stealing", label: "盗塁" },
  ];

  return metrics.map(metric => {
    const topPlayers = battingRecords[metric.key] || []; // 指標ごとのランキング取得
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

              {/* 値を表示（打率・出塁率は小数3桁表示） */}
              <span className="font-mono">
                {["avg", "obp"].includes(metric.key) ? player[metric.key].toFixed(3) : player[metric.key]}
              </span>

            </li>
          ))}
        </ul>
      </div>
    );
  });
}
