import React, { useEffect, useState } from "react";
import axios from "axios";

export default function PlayerRanking () {
  const [activeTab, setActiveTab] = useState("batting");
  const [battingRecords, setBattingRecords] = useState([]);
  const [pitchingRecords, setPitchingRecords] = useState([]);

  useEffect(() => {
    axios.get("/api/player/ranking").then((res) => {
      setBattingRecords(res.data.battingRecords);
      setPitchingRecords(res.data.pitchingRecords);
    });
  }, []);

  // ---------------- 打者ランキング集計 ----------------
  const battingStats = (() => {
    const grouped = {};
    battingRecords.forEach((rec) => {
      if (!grouped[rec.user_id]) {
        grouped[rec.user_id] = {
          user_id: rec.user_id,
          name: rec.name || `選手${rec.user_id}`,
          hits: 0,
          at_bats: 0,
          rbis: 0,
          steals: 0,
          walks: 0,
        };
      }
      grouped[rec.user_id].hits += rec.hits;
      grouped[rec.user_id].at_bats += rec.at_bats;
      grouped[rec.user_id].rbis += rec.rbis;
      grouped[rec.user_id].steals += rec.steals;
      grouped[rec.user_id].walks += rec.walks;
    });

    return Object.values(grouped).map((p) => {
      const avg = p.at_bats > 0 ? p.hits / p.at_bats : 0;
      const obp = p.at_bats + p.walks > 0 ? (p.hits + p.walks) / (p.at_bats + p.walks) : 0;
      return { ...p, avg, obp };
    });
  })();

  // ---------------- 投手ランキング集計 ----------------
  const pitchingStats = (() => {
    const grouped = {};
    pitchingRecords.forEach((rec) => {
      if (!grouped[rec.user_id]) {
        grouped[rec.user_id] = {
          user_id: rec.user_id,
          name: rec.name || `選手${rec.user_id}`,
          strikeouts: 0,
          wins: 0,
          outs: 0,
          earned_runs: 0,
        };
      }
      grouped[rec.user_id].strikeouts += rec.strikeouts;
      grouped[rec.user_id].outs += rec.pitching_innings_outs;
      grouped[rec.user_id].earned_runs += rec.earned_runs;

      if (rec.result === "win") grouped[rec.user_id].wins += 1;
    });

    return Object.values(grouped).map((p) => {
      const innings = p.outs / 3;
      const era = innings > 0 ? (p.earned_runs * 9) / innings : 0;
      return { ...p, era };
    });
  })();

  // ---------------- 打者カード ----------------
  const renderBattingCards = () => {
    const metrics = [
      { key: "avg", label: "打率", format: (v) => v.toFixed(3) },
      { key: "rbis", label: "打点", format: (v) => v },
      { key: "hits", label: "安打", format: (v) => v },
      { key: "steals", label: "盗塁", format: (v) => v },
    ];

    return metrics.map((metric) => {
      const sorted = [...battingStats].sort((a, b) => b[metric.key] - a[metric.key]);
      return (
        <div key={metric.key} className="bg-white shadow rounded p-4 mb-4">
          <h3 className="text-lg font-semibold mb-2">{metric.label}ランキング</h3>
          <ul className="space-y-1">
            {sorted.map((p, i) => (
              <li key={p.user_id}>
                {i + 1}. {p.name} - {metric.format(p[metric.key])}
              </li>
            ))}
          </ul>
        </div>
      );
    });
  };

  // ---------------- 投手カード ----------------
  const renderPitchingCards = () => {
    const metrics = [
      { key: "strikeouts", label: "奪三振", format: (v) => v },
      { key: "wins", label: "勝利", format: (v) => v },
      { key: "era", label: "防御率", format: (v) => v.toFixed(2) },
    ];

    return metrics.map((metric) => {
      const sorted = [...pitchingStats].sort((a, b) => b[metric.key] - a[metric.key]);
      return (
        <div key={metric.key} className="bg-white shadow rounded p-4 mb-4">
          <h3 className="text-lg font-semibold mb-2">{metric.label}ランキング</h3>
          <ul className="space-y-1">
            {sorted.map((p, i) => (
              <li key={p.user_id}>
                {i + 1}. {p.name} - {metric.format(p[metric.key])}
              </li>
            ))}
          </ul>
        </div>
      );
    });
  };

  return (
    <div className="p-6">
      {/* タブ切替 */}
      <div className="flex space-x-4 mb-4">
        <button
          className={`px-4 py-2 rounded ${activeTab === "batting" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
          onClick={() => setActiveTab("batting")}
        >
          打者ランキング
        </button>
        <button
          className={`px-4 py-2 rounded ${activeTab === "pitching" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
          onClick={() => setActiveTab("pitching")}
        >
          投手ランキング
        </button>
      </div>

      {/* 指標カード表示 */}
      {activeTab === "batting" ? renderBattingCards() : renderPitchingCards()}
    </div>
  );
};
