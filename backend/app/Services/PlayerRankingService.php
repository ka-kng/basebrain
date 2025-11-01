<?php

namespace App\Services;

use App\Models\BattingRecord;
use App\Models\PitchingRecord;
use Illuminate\Support\Facades\Auth;

class PlayerRankingService
{
  // 打者ランキング（指標ごとにソート、0は除外）
  public function getBattingRanking($limit = 5)
  {
    $teamId = Auth::user()->team_id; // ログイン中のチームID取得

    // チームごとにフィルタ
    $records = BattingRecord::with('user')
      ->whereHas('user', fn($q) => $q->where('team_id', $teamId))
      ->get();

    $grouped = [];

    foreach ($records as $record) {
      $userId = $record->user_id;

      // ユーザーごとの初期値を設定
      if (!isset($grouped[$userId])) {
        $grouped[$userId] = [
          'user_id' => $userId,
          'name' => $record->user->name,
          'hits' => 0,
          'at_bats' => 0,
          'walks' => 0,
          'home_runs' => 0,
          'rbis' => 0,
          'caught_stealing' => 0,
        ];
      }

      // 単打・二塁打・三塁打・本塁打を合計してヒット数に加算
      $totalHits = $record->hits + $record->doubles + $record->triples + $record->home_runs;

      // ユーザーごとに各指標を加算
      $grouped[$userId]['hits'] += $totalHits;
      $grouped[$userId]['at_bats'] += $record->at_bats;
      $grouped[$userId]['walks'] += $record->walks;
      $grouped[$userId]['home_runs'] += $record->home_runs;
      $grouped[$userId]['rbis'] += $record->rbis;
      $grouped[$userId]['caught_stealing'] += $record->caught_stealing;
    }

    // 打率・出塁率計算
    foreach ($grouped as &$player) { // 参照渡し

      // 打率 = ヒット数 / 打数
      $player['avg'] = $player['at_bats'] > 0 ? round($player['hits'] / $player['at_bats'], 3) : 0;

      // 出塁率 = (ヒット + 四球) / (打数 + 四球)
      $player['obp'] = ($player['at_bats'] + $player['walks']) > 0
        ? round(($player['hits'] + $player['walks']) / ($player['at_bats'] + $player['walks']), 3)
        : 0;
    }

    // Laravel Collection に変換して扱いやすく
    $collection = collect($grouped);

    // 各指標ごとにランキングを作成
    return [
      'avg' => $collection->filter(fn($p) => $p['avg'] > 0)
        ->sortByDesc('avg') // 降順でソート
        ->take($limit) // 上位$limit件
        ->values() // 配列のキーを連番に振り直す
        ->all(),

      'obp' => $collection->filter(fn($p) => $p['obp'] > 0)
        ->sortByDesc('obp')
        ->take($limit)
        ->values()
        ->all(),

      'hits' => $collection->filter(fn($p) => $p['hits'] > 0)
        ->sortByDesc('hits')
        ->take($limit)
        ->values()
        ->all(),

      'home_runs' => $collection->filter(fn($p) => $p['home_runs'] > 0)
        ->sortByDesc('home_runs')
        ->take($limit)
        ->values()
        ->all(),

      'rbis' => $collection->filter(fn($p) => $p['rbis'] > 0)
        ->sortByDesc('rbis')
        ->take($limit)
        ->values()
        ->all(),

      'caught_stealing' => $collection->filter(fn($p) => $p['caught_stealing'] > 0)
        ->sortByDesc('caught_stealing')
        ->take($limit)
        ->values()
        ->all(),
    ];
  }

  // 投手ランキング（指標ごとにソート、0は除外）
  public function getPitchingRanking($limit = 5)
  {
    $teamId = Auth::user()->team_id;

    $records = PitchingRecord::with('user')
        ->whereHas('user', fn($q) => $q->where('team_id', $teamId))
        ->get();

    $grouped = [];

    foreach ($records as $record) {
      $userId = $record->user_id;

      // ユーザーごとの初期値を設定
      if (!isset($grouped[$userId])) {
        $grouped[$userId] = [
          'user_id' => $userId,
          'name' => $record->user->name,
          'strikeouts' => 0,
          'outs' => 0,
          'earned_runs' => 0,
          'wins' => 0,
        ];
      }

      // 各指標を加算
      $grouped[$userId]['strikeouts'] += $record->strikeouts;
      $grouped[$userId]['outs'] += $record->pitching_innings_outs;
      $grouped[$userId]['earned_runs'] += $record->earned_runs;

      // 勝利の場合は勝利数を加算
      if ($record->result === '勝利') {
        $grouped[$userId]['wins'] += 1;
      }

    }

    // 防御率計算
    foreach ($grouped as &$player) {
      $innings = $player['outs'] / 3; // アウト数から投球回に変換
      $player['era'] = $innings > 0 ? round(($player['earned_runs'] * 9) / $innings, 2) : 0;
    }

    $collection = collect($grouped);

    // 各指標ごとにランキングを作成
    return [
      'era' => $collection
        ->sortBy('era') // 防御率は小さい順
        ->take($limit)
        ->values()
        ->all(),

      'wins' => $collection->filter(fn($p) => $p['wins'] > 0)
        ->sortByDesc('wins')
        ->take($limit)
        ->values()
        ->all(),

      'strikeouts' => $collection->filter(fn($p) => $p['strikeouts'] > 0)
        ->sortByDesc('strikeouts')
        ->take($limit)
        ->values()
        ->all(),
    ];
  }
}
