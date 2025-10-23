<?php

namespace App\Services;

use Illuminate\Support\Facades\DB;

class ManagerDashboardService
{
  // チーム全体のダッシュボードデータを取得
  public function getDashboardData($teamId)
  {
    // 指定チームの試合一覧を取得
    $games = DB::table('games')
      ->where('team_id', $teamId)
      ->get();

    // チーム情報集計
    $totalGames = $games->count();
    $totalWins = $games->where('result', '勝利')->count();
    $totalLoses = $games->where('result', '敗北')->count();
    $totalDraw = $games->where('result', '引き分け')->count();
    $winRatePercent = $totalGames ? round(($totalWins / $totalGames) * 100, 1) . '%' : '0%';

    $teamInfo = [
      'totalGames' => $totalGames,
      'wins' => $totalWins,
      'loses' => $totalLoses,
      'draws' => $totalDraw,
      'winRatePercent' => $winRatePercent,
    ];

    // 打撃成績を取得（gameと結合）
    $battingRecords = DB::table('batting_records')
      // games テーブルと結合（batting_records だけではチームがわからないため、チームを特定するために結合）
      ->join('games', 'batting_records.game_id', '=', 'games.id')
      ->where('games.team_id', $teamId)
      ->select('batting_records.*')
      ->get();

    // 投手成績を取得（gameと結合）
    $pitchingRecords = DB::table('pitching_records')
      ->join('games', 'pitching_records.game_id', '=', 'games.id')
      ->where('games.team_id', $teamId)
      ->select('pitching_records.*')
      ->get();

    // 集計処理
    $battingTotals = $this->summarizeBatting($battingRecords);
    $pitchingTotals = $this->summarizePitching($pitchingRecords);

    return [
      'games' => $games,
      'teamInfo' => $teamInfo,
      'battingTotals' => $battingTotals,
      'pitchingTotals' => $pitchingTotals,
    ];
  }

  // 打撃成績を集計する
  private function summarizeBatting($records): array
  {
    $fields = [
      'at_bats',
      'hits',
      'doubles',
      'triples',
      'home_runs',
      'runs',
      'rbis',
      'walks',
      'strikeouts',
      'steals',
      'caught_stealing',
      'errors',
    ];

    // 各項目を合計
    $totals = collect($fields)->mapWithKeys(fn($f) => [$f => $records->sum($f)])->toArray();

    // 打率 (すべてのヒットを含む)
    $totalHits = $totals['hits'] + $totals['doubles'] + $totals['triples'] + $totals['home_runs'];
    $totals['average'] = $totals['at_bats'] > 0
      ? number_format($totalHits / $totals['at_bats'], 3)
      : number_format(0, 3);

    // 出塁率 (ヒット + 四死球) ÷ (打数 + 四死球)
    $totals['obp'] = ($totals['at_bats'] + $totals['walks']) > 0
      ? number_format(($totalHits + $totals['walks']) / ($totals['at_bats'] + $totals['walks']), 3)
      : number_format(0, 3);

    // 長打率 ((単打 + 2*二塁打 + 3*三塁打 + 4*本塁打) ÷ 打数)
    $totalBases = $totals['hits'] + (2 * $totals['doubles']) + (3 * $totals['triples']) + (4 * $totals['home_runs']);
    $totals['slg'] = $totals['at_bats'] > 0
      ? number_format($totalBases / $totals['at_bats'], 3)
      : number_format(0, 3);

    return $totals;
  }

  // 投手成績を集計する
  private function summarizePitching($records): array
  {
    $fields = [
      'pitching_innings_outs',
      'earned_runs',
      'strikeouts',
      'walks',
      'hits_allowed',
      'hr_allowed',
      'runs_allowed',
    ];

    // 各項目を合計
    $totals = collect($fields)->mapWithKeys(fn($f) => [$f => $records->sum($f)])->toArray();

    // 投球回をイニングに換算
    $inningsPitched = $totals['pitching_innings_outs'] / 3;

    // 防御率 (ERA)
    $totals['era'] = $inningsPitched > 0
      ? number_format(($totals['earned_runs'] * 9) / $inningsPitched, 2)
      : number_format(0, 2);

    return $totals;
  }
}
