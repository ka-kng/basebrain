import { useEffect, useState } from "react";
import axios from "axios";

// ManagerDashboardコンポーネント本体
export default function ManagerDashboard() {
  const [data, setData] = useState(null); // APIから取得したダッシュボードデータを保存するstate
  const [loading, setLoading] = useState(true); // データ取得中かどうかを管理するstate

  // コンポーネントマウント時にデータ取得
  useEffect(() => {
    axios.get("/api/dashboard/manager") // 管理者用ダッシュボードAPIを呼び出す
      .then(res => setData(res.data)) // 成功したらstateに保存
      .finally(() => setLoading(false)); // 取得終了でローディングをfalseに
  }, []); // 空配列で初回レンダー時のみ実行

  if (loading) return <p className="text-center mt-10">Loading...</p>;
  if (!data) return <p className="text-center mt-10">データがありません</p>;

  const { teamInfo, battingTotals, pitchingTotals } = data;

  // スタットカードコンポーネント（ラベルと値を表示）
  const StatCard = ({ label, value, color }) => (
    <div className="flex justify-between items-center bg-white p-4 rounded-lg shadow-md">
      <span className={`font-semibold ${color || "text-gray-700"}`}>{label}</span>
      <span className={`font-bold text-lg ${color || "text-gray-800"}`}>{value}</span>
    </div>
  );

  return (
    <div className="max-w-xl mx-auto space-y-10">
      <h1 className="text-3xl font-bold text-gray-800 border-b-4 border-green-500 inline-block pb-2">
        チーム成績
      </h1>

      {/* チーム情報 */}
      <section className="bg-white shadow-md rounded-xl p-5">
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">チーム情報</h2>
        <div className="grid grid-cols-2 gap-4">
          <StatCard label="勝率" value={teamInfo.winRatePercent} color="text-green-600" />
          <StatCard label="試合数" value={teamInfo.totalGames} />
          <StatCard label="勝利数" value={teamInfo.wins} color="text-blue-600" />
          <StatCard label="敗北数" value={teamInfo.loses} color="text-red-500" />
          <StatCard label="引き分け数" value={teamInfo.draws} />
        </div>
      </section>

      {/* 打者成績 */}
      <section className="bg-white shadow-md rounded-xl p-5">
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">打者成績</h2>
        <div className="grid grid-cols-2 gap-4">
          <StatCard label="打率" value={battingTotals.average} color="text-green-600" />
          <StatCard label="出塁率" value={battingTotals.obp} color="text-green-600" />
          <StatCard label="長打率" value={battingTotals.slg} color="text-green-600" />
          <StatCard label="打数" value={battingTotals.at_bats} color="text-blue-600" />
          <StatCard label="ヒット" value={battingTotals.hits} color="text-blue-600" />
          <StatCard label="二塁打" value={battingTotals.doubles} color="text-blue-600" />
          <StatCard label="三塁打" value={battingTotals.triples} color="text-blue-600" />
          <StatCard label="本塁打" value={battingTotals.home_runs} color="text-blue-600" />
          <StatCard label="得点" value={battingTotals.runs} color="text-blue-600" />
          <StatCard label="打点" value={battingTotals.rbis} color="text-blue-600" />
          <StatCard label="四死球" value={battingTotals.walks} color="text-blue-600" />
          <StatCard label="盗塁" value={battingTotals.steals} color="text-blue-600" />
          <StatCard label="盗塁死" value={battingTotals.caught_stealing} color="text-blue-600" />
          <StatCard label="三振" value={battingTotals.strikeouts} color="text-red-500" />
          <StatCard label="失策" value={battingTotals.errors} color="text-red-500" />
        </div>
      </section>

      {/* 投手成績 */}
      <section className="bg-white shadow-md rounded-xl p-5">
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">投手成績</h2>
        <div className="grid grid-cols-2 gap-4">
          <StatCard label="防御率" value={pitchingTotals.era} color="text-green-600" />
          <StatCard label="奪三振" value={pitchingTotals.strikeouts} color="text-blue-600" />
          <StatCard label="被安打" value={pitchingTotals.hits_allowed} color="text-red-500" />
          <StatCard label="被本塁打" value={pitchingTotals.hr_allowed} color="text-red-500" />
          <StatCard label="与四死球" value={pitchingTotals.walks} color="text-red-500" />
          <StatCard label="失点" value={pitchingTotals.runs_allowed} color="text-red-500" />
          <StatCard label="自責点" value={pitchingTotals.earned_runs} color="text-red-500" />
        </div>
      </section>
    </div>
  );
}
