import React, { useEffect, useState } from "react";
import axios from "axios";
import RenderBattingCards from "../../features/Ranking/RenderBattingCards";
import RenderPitchingCards from "../../features/Ranking/RenderPitchingCards";

// PlayerRankingコンポーネント本体
export default function PlayerRanking() {
  const [activeTab, setActiveTab] = useState("batting"); // 現在選択中のタブ（batting or pitching）を管理
  const [battingRecords, setBattingRecords] = useState([]); // 打者ランキングデータを格納
  const [pitchingRecords, setPitchingRecords] = useState([]); // 投手ランキングデータを格納
  const [loading, setLoading] = useState(true); // データ取得中かどうかを管理

  // コンポーネントマウント時にAPIからランキング取得
  useEffect(() => {
    axios
      .get("/api/player/ranking") // APIエンドポイント
      .then((res) => {
        setBattingRecords(res.data.battingRecords); // 打者データをstateに保存
        setPitchingRecords(res.data.pitchingRecords); // 投手データをstateに保存
      })
      .finally(() => setLoading(false)); // ローディング終了
  }, []); // 初回レンダリング時のみ実行

  // ローディング中表示
  if (loading) return <p className="text-center mt-10">Loading...</p>;

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
      {activeTab === "batting"
        ? <RenderBattingCards battingRecords={battingRecords} />
        : <RenderPitchingCards pitchingRecords={pitchingRecords} />}
    </div>
  );
}
