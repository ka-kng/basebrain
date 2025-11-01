<?php

namespace App\Services;

use App\Models\BattingRecord;
use App\Models\PitchingRecord;

class PlayerDashboardService
{
  // ユーザーIDごとの個人成績データを取得
  public function getPlayerDashboardData(int $userId)
  {
    //  打者成績を取得
    $battingRecords = BattingRecord::where('user_id', $userId)->get();

    //  投手成績を取得
    $pitchingRecords = PitchingRecord::where('user_id', $userId)->get();

    // 試合数（打撃成績レコードから 試合IDだけを取り出し、重複をなくす）
    $games = $battingRecords->pluck('game_id')->unique();

    //  打者統計計算
    $totalSingles = $battingRecords->sum('hits'); // 一塁打
    $totalDoubles = $battingRecords->sum('doubles'); // 二塁打
    $totalTriples = $battingRecords->sum('triples'); // 三塁打
    $totalHomeRuns = $battingRecords->sum('home_runs'); // 本塁打
    $totalAtBats = $battingRecords->sum('at_bats'); // 打数
    $totalWalks = $battingRecords->sum('walks'); // 四死球
    $totalRuns = $battingRecords->sum('runs'); // 得点
    $totalRbis = $battingRecords->sum('rbis'); // 打点
    $totalSteals = $battingRecords->sum('steals'); // 盗塁
    $totalCaughtStealing = $battingRecords->sum('caught_stealing'); // 盗塁成功数
    $totalStrikeouts = $battingRecords->sum('strikeouts'); // 三振
    $totalErrors = $battingRecords->sum('errors'); // 失策

    // 合計安打 = 一塁打 + 二塁打 + 三塁打 + 本塁打
    $totalHits = $totalSingles + $totalDoubles + $totalTriples + $totalHomeRuns;

    // 打率 (安打 / 打数) ※0.000形式に
    $battingAverage = $totalAtBats ? number_format($totalHits / $totalAtBats, 3) : '0.000';

    // 出塁率 (安打 + 四死球) / (打数 + 四死球)
    $onBasePercentage = ($totalAtBats + $totalWalks)
      ? number_format(($totalHits + $totalWalks) / ($totalAtBats + $totalWalks), 3)
      : '0.000';

    // 総塁打 = 一塁打 + 2*二塁打 + 3*三塁打 + 4*本塁打
    $totalBases = $totalSingles + (2 * $totalDoubles) + (3 * $totalTriples) + (4 * $totalHomeRuns);

    // 長打率 = 総塁打 / 打数
    $sluggingPercentage = $totalAtBats ? number_format($totalBases / $totalAtBats, 3) : '0.000';

    // 盗塁成功率 (%) = 盗塁成功 / 盗塁
    $stealFailureRate = $totalSteals
      ? number_format($totalCaughtStealing / $totalSteals, 3)
      : '0.000';

    //  投手統計計算
    $totalInningsOuts = $pitchingRecords->sum('pitching_innings_outs'); // 投球アウト
    $totalInnings = $totalInningsOuts / 3;
    $totalStrikeoutsPitcher = $pitchingRecords->sum('strikeouts'); // 奪三振
    $totalHitsAllowed = $pitchingRecords->sum('hits_allowed'); // 被安打
    $totalHrAllowed = $pitchingRecords->sum('hr_allowed'); // 被本塁打
    $totalWalksGiven = $pitchingRecords->sum('walks_given'); // 与四死球
    $totalRunsAllowed = $pitchingRecords->sum('runs_allowed'); // 失点
    $totalEarnedRuns = $pitchingRecords->sum('earned_runs'); // 自責点

    // 防御率 = (自責点 / 投球回) * 3
    $era = $totalInnings > 0 ? number_format(($totalEarnedRuns * 9) / $totalInnings, 2) : '0.00';

    //  JSON形式で返却
    return [
      'games' => $games->count(), // 試合数
      'batting' => [
        'batting_average' => $battingAverage, // 打率
        'on_base_percentage' => $onBasePercentage, // 出塁率
        'slugging_percentage' => $sluggingPercentage, // 長打率
        'steal_success_rate' => $stealFailureRate, // 盗塁成功率
        'at_bats' => $totalAtBats, // 打数
        'singles' => $totalSingles, // 一塁打
        'doubles' => $totalDoubles, // 二塁打
        'triples' => $totalTriples, // 三塁打
        'home_runs' => $totalHomeRuns, // 本塁打
        'runs' => $totalRuns, // 得点
        'rbis' => $totalRbis, // 打点
        'walks' => $totalWalks, // 四死球
        'steals' => $totalSteals, // 盗塁
        'caught_stealing' => $totalCaughtStealing, // 盗塁死
        'strikeouts' => $totalStrikeouts, // 三振
        'errors' => $totalErrors, // 失策
      ],
      'pitching' => [
        'era' => $era, // 防御率
        'strikeouts' => $totalStrikeoutsPitcher, // 奪三振
        'hits_allowed' => $totalHitsAllowed, // 被安打
        'hr_allowed' => $totalHrAllowed, // 被本塁打
        'walks_given' => $totalWalksGiven, // 与四死球
        'runs_allowed' => $totalRunsAllowed, // 失点
        'earned_runs' => $totalEarnedRuns, // 自責点
      ],
    ];
  }
}
