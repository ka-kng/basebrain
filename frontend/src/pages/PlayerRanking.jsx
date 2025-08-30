import React, { useEffect, useState } from "react";
import axios from "axios";

export default function PlayerRanking() {
  const [activeTab, setActiveTab] = useState("batting"); // 現在選択中のタブ
  const [battingRecords, setBattingRecords] = useState([]); // 打者データ
  const [pitchingRecords, setPitchingRecords] = useState([]); // 投手データ

  // 初回レンダー時にAPIからデータ取得
  useEffect(() => {
    axios.get("/api/player/ranking").then((response) => {
      setBattingRecords(response.data.battingRecords);
      setPitchingRecords(response.data.pitchingRecords);
    });
  }, []);

  // ---------------- 打者ランキング集計 ----------------
  const battingStats = (() => {
    const groupedPlayers = {};

    battingRecords.forEach((record) => {
      if (!groupedPlayers[record.user_id]) {
        groupedPlayers[record.user_id] = {
          user_id: record.user_id,
          name: record.name || `選手${record.user_id}`,
          hits: 0,
          at_bats: 0,
          rbis: 0,
          caught_stealing: 0,
          walks: 0,
          home_runs: 0,
        };
      }
      const player = groupedPlayers[record.user_id];
      player.hits += record.hits || 0;
      player.at_bats += record.at_bats || 0;
      player.rbis += record.rbis || 0;
      player.caught_stealing += record.caught_stealing || 0;
      player.walks += record.walks || 0;
      player.home_runs += record.home_runs || 0;
    });

    return Object.values(groupedPlayers).map((player) => {
      const avg = player.at_bats > 0 ? player.hits / player.at_bats : 0;
      const obp =
        player.at_bats + player.walks > 0
          ? (player.hits + player.walks) / (player.at_bats + player.walks)
          : 0;
      return { ...player, avg, obp };
    });
  })();

  // ---------------- 投手ランキング集計 ----------------
  const pitchingStats = (() => {
    const groupedPlayers = {};

    pitchingRecords.forEach((record) => {
      if (!groupedPlayers[record.user_id]) {
        groupedPlayers[record.user_id] = {
          user_id: record.user_id,
          name: record.name || `選手${record.user_id}`,
          strikeouts: 0,
          wins: 0,
          outs: 0,
          earned_runs: 0,
        };
      }
      const player = groupedPlayers[record.user_id];
      player.strikeouts += record.strikeouts || 0;
      player.outs += record.pitching_innings_outs || 0;
      player.earned_runs += record.earned_runs || 0;
      if (record.result === "勝利") player.wins += 1;
    });

    return Object.values(groupedPlayers).map((player) => {
      const innings = player.outs / 3;
      const era = innings > 0 ? (player.earned_runs * 9) / innings : 0;
      return { ...player, era };
    });
  })();

  // ---------------- 打者カード描画 ----------------
  const renderBattingCards = () => {
    const metrics = [
      { key: "avg", label: "打率", format: (v) => v.toFixed(3) },
      { key: "obp", label: "出塁率", format: (v) => v.toFixed(3) },
      { key: "hits", label: "安打", format: (v) => v },
      { key: "home_runs", label: "本塁打", format: (v) => v },
      { key: "rbis", label: "打点", format: (v) => v },
      { key: "caught_stealing", label: "盗塁", format: (v) => v },
    ];

    return metrics.map((metric) => {
      // 指標で降順ソート
      const sortedPlayers = [...battingStats].sort(
        (a, b) => b[metric.key] - a[metric.key]
      );

      // 同着対応で順位を計算
      let lastValue = null;
      let lastRank = 0;
      let index = 0;
      const rankedPlayers = sortedPlayers.map((player) => {
        index += 1;
        if (player[metric.key] !== lastValue) {
          lastRank = index;
        }
        lastValue = player[metric.key];
        return { ...player, rank: lastRank };
      }).slice(0, 3); // 上位3名のみ表示

      return (
        <div key={metric.key} className="bg-white shadow-md rounded-xl p-4 mb-4">
          <h3 className="text-lg font-bold mb-2">{metric.label}</h3>
          <ul>
            {rankedPlayers.map((player) => (
              <li
                key={player.user_id}
                className="flex justify-between py-2 border-b last:border-b-0"
              >
                <span>{player.rank}. {player.name}</span>
                <span className="font-mono">{metric.format(player[metric.key])}</span>
              </li>
            ))}
          </ul>
        </div>
      );
    });
  };

  // ---------------- 投手カード描画 ----------------
  const renderPitchingCards = () => {
    const metrics = [
      { key: "era", label: "防御率", format: (v) => v.toFixed(2), ascending: true },
      { key: "wins", label: "勝利数", format: (v) => v },
      { key: "strikeouts", label: "奪三振数", format: (v) => v },
    ];

    return metrics.map((metric) => {
      const sortedPlayers = [...pitchingStats].sort((a, b) =>
        metric.ascending ? a[metric.key] - b[metric.key] : b[metric.key] - a[metric.key]
      );

      let lastValue = null;
      let lastRank = 0;
      let index = 0;
      const rankedPlayers = sortedPlayers.map((player) => {
        index += 1;
        if (player[metric.key] !== lastValue) {
          lastRank = index;
        }
        lastValue = player[metric.key];
        return { ...player, rank: lastRank };
      }).slice(0, 3);

      return (
        <div key={metric.key} className="bg-white shadow-md rounded-xl p-4 mb-4">
          <h3 className="text-lg font-bold mb-2">{metric.label}</h3>
          <ul>
            {rankedPlayers.map((player) => (
              <li
                key={player.user_id}
                className="flex justify-between py-2 border-b last:border-b-0"
              >
                <span>{player.rank}. {player.name}</span>
                <span className="font-mono">{metric.format(player[metric.key])}</span>
              </li>
            ))}
          </ul>
        </div>
      );
    });
  };

  return (
    <div className="max-w-2xl mx-auto min-h-screen">
      {/* タブ切替 */}
      <div className="flex justify-center space-x-4 mb-6">
        <button
          className={`px-5 py-2 rounded-full font-semibold transition-colors ${
            activeTab === "batting" ? "bg-indigo-600 text-white" : "bg-gray-200 text-gray-700"
          }`}
          onClick={() => setActiveTab("batting")}
        >
          打者ランキング
        </button>
        <button
          className={`px-5 py-2 rounded-full font-semibold transition-colors ${
            activeTab === "pitching" ? "bg-red-600 text-white" : "bg-gray-200 text-gray-700"
          }`}
          onClick={() => setActiveTab("pitching")}
        >
          投手ランキング
        </button>
      </div>

      {/* 指標カード表示 */}
      {activeTab === "batting" ? renderBattingCards() : renderPitchingCards()}
    </div>
  );
}
