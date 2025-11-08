import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../../Auth/AuthContext";
import StatCard from "../../features/Dashboard/StatCard";

// PlayerDashboardコンポーネント本体
export default function PlayerDashboard() {
  const { user } = useAuth(); // 認証済みユーザー情報を取得
  const [loading, setLoading] = useState(true); // データ取得中かどうかを管理
  const [dashboard, setDashboard] = useState({ // ダッシュボード情報を管理
    games: 0, // 出場試合数
    batting: {}, // 打者成績
    pitching: {}, // 投手成績
  });

  // コンポーネントマウント時またはuser変更時にAPI取得
  useEffect(() => {
    if (!user) return; // ユーザー情報がない場合は処理中止
    setLoading(true); // ローディング開始

    // APIからプレイヤーダッシュボード情報を取得
    axios.get("/api/dashboard/player")
      .then(res => {
        setDashboard(res.data); // データをstateに保存
      })
      .finally(() => setLoading(false)); // ローディング終了
  }, [user]); // userが変更されたときのみ実行

  if (loading) return <p className="text-center mt-10">Loading...</p>;

  // ダッシュボードデータを分割代入
  const { games, batting, pitching } = dashboard;

  return (
    <div className="max-w-xl mx-auto space-y-10">
      <h1 className="text-3xl font-bold text-gray-800 border-b-4 border-green-500 inline-block pb-2">個人成績</h1>

      {/* 出場数 */}
      <div className="bg-white shadow-md rounded-xl p-5">
        <h2 className="text-2xl font-semibold mb-4">出場情報</h2>
        <StatCard label="試合数" value={games} />
      </div>

      {/* 打者成績 */}
      <div className="bg-white shadow-md rounded-xl p-5">
        <h2 className="text-2xl font-semibold mb-4">打者成績</h2>
        <div className="grid grid-cols-2 gap-4">
          <StatCard label="打率" value={batting.batting_average} color="text-green-600" />
          <StatCard label="出塁率" value={batting.on_base_percentage} color="text-green-600" />
          <StatCard label="長打率" value={batting.slugging_percentage} color="text-green-600" />
          <StatCard label="盗塁率" value={batting.steal_success_rate} color="text-green-600" />
          <StatCard label="打数" value={batting.at_bats} color="text-blue-600" />
          <StatCard label="一塁打" value={batting.singles} color="text-blue-600" />
          <StatCard label="二塁打" value={batting.doubles} color="text-blue-600" />
          <StatCard label="三塁打" value={batting.triples} color="text-blue-600" />
          <StatCard label="本塁打" value={batting.home_runs} color="text-blue-600" />
          <StatCard label="得点" value={batting.runs} color="text-blue-600" />
          <StatCard label="打点" value={batting.rbis} color="text-blue-600" />
          <StatCard label="四死球" value={batting.walks} color="text-blue-600" />
          <StatCard label="盗塁" value={batting.steals} color="text-blue-600" />
          <StatCard label="盗塁成功数" value={batting.caught_stealing} color="text-blue-600" />
          <StatCard label="三振" value={batting.strikeouts} color="text-red-600" />
          <StatCard label="失策" value={batting.errors} color="text-red-600" />
        </div>
      </div>

      {/* 投手成績 */}
      <div className="bg-white shadow-md rounded-xl p-5">
        <h2 className="text-2xl font-semibold mb-4">投手成績</h2>
        <div className="grid grid-cols-2 gap-4">
          <StatCard label="防御率" value={pitching.era} color="text-green-600" />
          <StatCard label="奪三振" value={pitching.strikeouts} color="text-blue-600" />
          <StatCard label="被安打" value={pitching.hits_allowed} color="text-red-600" />
          <StatCard label="被本塁打" value={pitching.hr_allowed} color="text-red-600" />
          <StatCard label="与四死球" value={pitching.walks_given} color="text-red-600" />
          <StatCard label="失点" value={pitching.runs_allowed} color="text-red-600" />
          <StatCard label="自責点" value={pitching.earned_runs} color="text-red-600" />
        </div>
      </div>
    </div>
  );
}
