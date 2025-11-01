import React, { useEffect, useState } from "react";
import axios from "axios";

export default function PlayerRanking() {
  const [activeTab, setActiveTab] = useState("batting");
  const [battingRecords, setBattingRecords] = useState([]);
  const [pitchingRecords, setPitchingRecords] = useState([]);
  const [loading, setLoading] = useState(true);

  // APIから打者・投手ランキング取得
  useEffect(() => {
    axios
      .get("/api/player/ranking")
      .then((res) => {
        setBattingRecords(res.data.battingRecords);
        setPitchingRecords(res.data.pitchingRecords);
      })
      .finally(() => setLoading(false));
  }, []);

  // ローディング中表示
  if (loading) return <p className="text-center mt-10">Loading...</p>;

  // 打者ランキングカードを生成
  const renderBattingCards = () => {
    const metrics = [
      { key: "avg", label: "打率" },
      { key: "obp", label: "出塁率" },
      { key: "hits", label: "安打" },
      { key: "home_runs", label: "本塁打" },
      { key: "rbis", label: "打点" },
      { key: "caught_stealing", label: "盗塁" },
    ];

    return metrics.map(metric => {
      const topPlayers = battingRecords[metric.key] || [];
      return (
        <div key={metric.key} className="bg-white shadow-md rounded-xl p-4 mb-4">
          <h3 className="text-lg font-bold mb-2">{metric.label}</h3>
          <ul>
            {topPlayers.map((player, index) => (
              <li key={player.user_id} className="flex justify-between py-2 border-b last:border-b-0">

                <span>{index + 1}. {player.name}</span>

                <span className="font-mono">
                  {["avg", "obp"].includes(metric.key) ? player[metric.key].toFixed(3) : player[metric.key]}
                </span>

              </li>
            ))}
          </ul>
        </div>
      );
    });
  };

  // 投手ランキングカードを生成
  const renderPitchingCards = () => {
    const metrics = [
      { key: "era", label: "防御率" },
      { key: "wins", label: "勝利数" },
      { key: "strikeouts", label: "奪三振数" },
    ];

    return metrics.map(metric => {
      const topPlayers = pitchingRecords[metric.key] || [];
      return (
        <div key={metric.key} className="bg-white shadow-md rounded-xl p-4 mb-4">
          <h3 className="text-lg font-bold mb-2">{metric.label}</h3>

          <ul>
            {topPlayers.map((player, index) => (

              <li key={player.user_id} className="flex justify-between py-2 border-b last:border-b-0">
                <span>{index + 1}. {player.name}</span>

                <span className="font-mono">
                  {metric.key === "era" ? player[metric.key].toFixed(2) : player[metric.key]}
                </span>

              </li>
            ))}

          </ul>
        </div>
      );
    });
  };

  return (
    <div className="max-w-2xl mx-auto min-h-screen">
      <h1 className="text-3xl font-bold text-gray-800 border-b-4 border-green-500 inline-block pb-2 mb-10">
        成績ランキング
      </h1>

      {/* タブ */}
      <div className="flex justify-center space-x-4 mb-6">
        <button
          className={`px-5 py-2 rounded-full font-semibold transition-colors ${activeTab === "batting" ? "bg-indigo-600 text-white" : "bg-gray-200 text-gray-700"
            }`}
          onClick={() => setActiveTab("batting")}
        >
          打者ランキング
        </button>
        <button
          className={`px-5 py-2 rounded-full font-semibold transition-colors ${activeTab === "pitching" ? "bg-red-600 text-white" : "bg-gray-200 text-gray-700"
            }`}
          onClick={() => setActiveTab("pitching")}
        >
          投手ランキング
        </button>
      </div>

      {/* カード表示 */}
      {activeTab === "batting" ? renderBattingCards() : renderPitchingCards()}
    </div>
  );
}
