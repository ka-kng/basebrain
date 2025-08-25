import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../contexts/AuthContext";

export default function PlayerDashboard() {
  const { user } = useAuth();
  const [games, setGames] = useState([]);
  const [battingRecords, setBattingRecords] = useState([]);
  const [pitchingRecords, setPitchingRecords] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    axios.get("/api/dashboard/player")
      .then(res => {
        setGames(res.data.games);
        setBattingRecords(res.data.battingRecords);
        setPitchingRecords(res.data.pitchingRecords);
      })
      .finally(() => setLoading(false));
  }, [user]);

  if (loading) return <p className="text-center mt-10">Loading...</p>;

  const totalGames = games.length;

  // --- 打者統計 ---
  const totalAtBats = battingRecords.reduce((sum, r) => sum + Number(r.at_bats || 0), 0);
  const totalHits = battingRecords.reduce((sum, r) => sum + Number(r.hits || 0), 0);
  const totalDoubles = battingRecords.reduce((sum, r) => sum + Number(r.doubles || 0), 0);
  const totalTriples = battingRecords.reduce((sum, r) => sum + Number(r.triples || 0), 0);
  const totalHomeRuns = battingRecords.reduce((sum, r) => sum + Number(r.home_runs || 0), 0);
  const totalRuns = battingRecords.reduce((sum, r) => sum + Number(r.runs || 0), 0);
  const totalRbis = battingRecords.reduce((sum, r) => sum + Number(r.rbis || 0), 0);
  const totalWalks = battingRecords.reduce((sum, r) => sum + Number(r.walks || 0), 0);
  const totalStrikeouts = battingRecords.reduce((sum, r) => sum + Number(r.strikeouts || 0), 0);
  const totalSteals = battingRecords.reduce((sum, r) => sum + Number(r.steals || 0), 0);
  const totalCaughtStealing = battingRecords.reduce((sum, r) => sum + Number(r.caught_stealing || 0), 0);
  const totalErrors = battingRecords.reduce((sum, r) => sum + Number(r.errors || 0), 0);

  const battingAverage = totalAtBats ? (totalHits / totalAtBats).toFixed(3) : "0.000";
  const onBasePercentage = totalAtBats + totalWalks
    ? ((totalHits + totalWalks) / (totalAtBats + totalWalks)).toFixed(3)
    : "0.000";
  const totalBases = totalHits + totalDoubles + (2 * totalTriples) + (3 * totalHomeRuns);
  const sluggingPercentage = totalAtBats ? (totalBases / totalAtBats).toFixed(3) : "0.000";
  const stealSuccessRate = totalSteals + totalCaughtStealing
    ? ((totalSteals / (totalSteals + totalCaughtStealing)) * 100).toFixed(1) + "%"
    : "0%";

  // --- 投手統計 ---
  const totalInningsOuts = pitchingRecords.reduce((sum, r) => sum + Number(r.pitching_innings_outs || 0), 0);
  const totalPitcherStrikeouts = pitchingRecords.reduce((sum, r) => sum + Number(r.strikeouts || 0), 0);
  const totalHitsAllowed = pitchingRecords.reduce((sum, r) => sum + Number(r.hits_allowed || 0), 0);
  const totalHrAllowed = pitchingRecords.reduce((sum, r) => sum + Number(r.hr_allowed || 0), 0);
  const totalWalksGiven = pitchingRecords.reduce((sum, r) => sum + Number(r.walks_given || 0), 0);
  const totalRunsAllowed = pitchingRecords.reduce((sum, r) => sum + Number(r.runs_allowed || 0), 0);
  const totalEarnedRuns = pitchingRecords.reduce((sum, r) => sum + Number(r.earned_runs || 0), 0);

  const era = totalInningsOuts ? ((totalEarnedRuns / totalInningsOuts) * 3).toFixed(2) : "0.00";

  // --- 共通カード ---
  const StatCard = ({ label, value, color }) => (
    <div className="flex justify-between items-center bg-white p-4 rounded-lg shadow-md">
      <span className={`font-semibold ${color || "text-gray-700"}`}>{label}</span>
      <span className={`font-bold text-lg ${color || "text-gray-800"}`}>{value}</span>
    </div>
  );

  return (
    <div className="p-4 pb-16 bg-gray-50 min-h-screen space-y-10">
      <h1 className="text-3xl font-bold text-gray-800 border-b-4 border-green-500 inline-block pb-2">個人成績</h1>

      {/* 出場数 */}
      <div className="bg-white shadow-md rounded-xl p-5">
        <h2 className="text-2xl font-semibold mb-4">出場情報</h2>
        <StatCard label="試合数" value={totalGames} />
      </div>

      {/* 打者成績 */}
      <div className="bg-white shadow-md rounded-xl p-5">
        <h2 className="text-2xl font-semibold mb-4">打者成績</h2>
        <div className="grid grid-cols-2 gap-4">
          <StatCard label="打率" value={battingAverage} color="text-green-600" />
          <StatCard label="出塁率" value={onBasePercentage} color="text-green-600" />
          <StatCard label="長打率" value={sluggingPercentage} color="text-green-600" />
          <StatCard label="盗塁率" value={stealSuccessRate} color="text-green-600" />
          <StatCard label="打数" value={totalAtBats} color="text-blue-600"/>
          <StatCard label="一塁打" value={totalHits} color="text-blue-600"/>
          <StatCard label="二塁打" value={totalDoubles} color="text-blue-600"/>
          <StatCard label="三塁打" value={totalTriples} color="text-blue-600"/>
          <StatCard label="本塁打" value={totalHomeRuns} color="text-blue-600"/>
          <StatCard label="得点" value={totalRuns} color="text-blue-600"/>
          <StatCard label="打点" value={totalRbis} color="text-blue-600"/>
          <StatCard label="四死球" value={totalWalks} color="text-blue-600"/>
          <StatCard label="盗塁" value={totalSteals} color="text-blue-600"/>
          <StatCard label="盗塁成功数" value={totalCaughtStealing} color="text-blue-600"/>
          <StatCard label="三振" value={totalStrikeouts} color="text-red-600"/>
          <StatCard label="失策" value={totalErrors} color="text-red-600"/>
        </div>
      </div>

      {/* 投手成績 */}
      <div className="bg-white shadow-md rounded-xl p-5">
        <h2 className="text-2xl font-semibold mb-4">投手成績</h2>
        <div className="grid grid-cols-2 gap-4">
          <StatCard label="防御率" value={era} color="text-green-600" />
          <StatCard label="奪三振" value={totalPitcherStrikeouts} color="text-blue-600"/>
          <StatCard label="被安打" value={totalHitsAllowed} color="text-red-600"/>
          <StatCard label="被本塁打" value={totalHrAllowed} color="text-red-600" />
          <StatCard label="与四死球" value={totalWalksGiven} color="text-red-600"/>
          <StatCard label="失点" value={totalRunsAllowed} color="text-red-600"/>
          <StatCard label="自責点" value={totalEarnedRuns} color="text-red-600"/>
        </div>
      </div>
    </div>
  );
}
