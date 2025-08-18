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

  // 打者統計
  const totalAtBats = battingRecords.reduce((sum, record) => sum + Number(record.at_bats || 0), 0);
  const totalHits = battingRecords.reduce((sum, record) => sum + Number(record.hits || 0), 0);
  const totalRuns = battingRecords.reduce((sum, record) => sum + Number(record.runs || 0), 0);
  const totalRbis = battingRecords.reduce((sum, record) => sum + Number(record.rbis || 0), 0);
  const totalWalks = battingRecords.reduce((sum, record) => sum + Number(record.walks || 0), 0);
  const totalStrikeouts = battingRecords.reduce((sum, record) => sum + Number(record.strikeouts || 0), 0);
  const totalSteals = battingRecords.reduce((sum, record) => sum + Number(record.steals || 0), 0);
  const totalCaughtStealing = battingRecords.reduce((sum, record) => sum + Number(record.caught_stealing || 0), 0);
  const totalErrors = battingRecords.reduce((sum, record) => sum + Number(record.errors || 0), 0);

  const battingAverage = totalAtBats ? (totalHits / totalAtBats).toFixed(3) : "0.000";
  const onBasePercentage = totalAtBats + totalWalks ? ((totalHits + totalWalks) / (totalAtBats + totalWalks)).toFixed(3) : "0.000";
  const stealSuccessRate = totalSteals + totalCaughtStealing ? (totalSteals / (totalSteals + totalCaughtStealing) * 100).toFixed(1) : "0";

  // 投手統計
  const totalInningsOuts = pitchingRecords.reduce((sum, record) => sum + Number(record.pitching_innings_outs || 0), 0);
  const totalPitcherStrikeouts = pitchingRecords.reduce((sum, record) => sum + Number(record.strikeouts || 0), 0);
  const totalHitsAllowed = pitchingRecords.reduce((sum, record) => sum + Number(record.hits_allowed || 0), 0);
  const totalHrAllowed = pitchingRecords.reduce((sum, record) => sum + Number(record.hr_allowed || 0), 0);
  const totalWalksGiven = pitchingRecords.reduce((sum, record) => sum + Number(record.walks_given || 0), 0);
  const totalRunsAllowed = pitchingRecords.reduce((sum, record) => sum + Number(record.runs_allowed || 0), 0);
  const totalEarnedRuns = pitchingRecords.reduce((sum, record) => sum + Number(record.earned_runs || 0), 0);

  const era = totalInningsOuts ? ((totalEarnedRuns / totalInningsOuts) * 3).toFixed(2) : "0.00";

  return (
    <div className="p-5 pb-20 max-w-5xl mx-auto space-y-8">
      <h1 className="text-2xl font-bold text-center mb-5">個人の成績</h1>

      {/* チーム情報 */}
      <div className="bg-white shadow-md rounded-lg p-5">
        <h2 className="text-xl font-semibold mb-3">出場数</h2>
        <p className="text-lg font-bold text-left text-gray-700">試合数: {totalGames}</p>
      </div>

      {/* 打者成績 */}
      <div className="bg-white shadow-md rounded-lg p-5">
        <h2 className="text-xl font-semibold mb-3">打者成績</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-left text-gray-700">
          <p className="text-lg font-bold">打数: {totalAtBats}</p>
          <p className="text-lg font-bold">安打: {totalHits}</p>
          <p className="text-lg font-bold">打率: {battingAverage}</p>
          <p className="text-lg font-bold">出塁率: {onBasePercentage}</p>
          <p className="text-lg font-bold">得点: {totalRuns}</p>
          <p className="text-lg font-bold">打点: {totalRbis}</p>
          <p className="text-lg font-bold">四死球: {totalWalks}</p>
          <p className="text-lg font-bold">三振: {totalStrikeouts}</p>
          <p className="text-lg font-bold">盗塁: {totalSteals}</p>
          <p className="text-lg font-bold">盗塁成功率: {stealSuccessRate}%</p>
          <p className="text-lg font-bold">失策: {totalErrors}</p>
        </div>
      </div>

      {/* 投手成績 */}
      <div className="bg-white shadow-md rounded-lg p-5">
        <h2 className="text-xl font-semibold mb-3">投手成績</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-left text-gray-700">
          <p className="text-lg font-bold">防御率: {era}</p>
          <p className="text-lg font-bold">奪三振: {totalPitcherStrikeouts}</p>
          <p className="text-lg font-bold">被安打: {totalHitsAllowed}</p>
          <p className="text-lg font-bold">被本塁打: {totalHrAllowed}</p>
          <p className="text-lg font-bold">与四死球: {totalWalksGiven}</p>
          <p className="text-lg font-bold">失点: {totalRunsAllowed}</p>
          <p className="text-lg font-bold">自責点: {totalEarnedRuns}</p>
        </div>
      </div>
    </div>
  );
}
