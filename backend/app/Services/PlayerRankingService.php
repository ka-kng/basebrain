<?php

namespace App\Services;

use App\Models\BattingRecord;
use App\Models\PitchingRecord;

class PlayerRankingService
{
  // 打者ランキング（指標ごとにソート）
  public function getBattingRanking($limit = 5)
  {
    // すべての打者成績を取得（リレーションでユーザーも取得）
    $records = BattingRecord::with('user')->get();

    $grouped = [];
    foreach ($records as $record) {

      $userId = $record->user_id;

      // 選手ごとの集計配列にまだ存在しない場合、初期値を作る
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

      // 安打数を合計（単打 + 二塁打 + 三塁打 + 本塁打）
      $totalHits = $record->hits + $record->doubles + $record->triples + $record->home_runs;

      $grouped[$userId]['hits'] += $totalHits;
      $grouped[$userId]['at_bats'] += $record->at_bats;
      $grouped[$userId]['walks'] += $record->walks;
      $grouped[$userId]['home_runs'] += $record->home_runs;
      $grouped[$userId]['rbis'] += $record->rbis;
      $grouped[$userId]['caught_stealing'] += $record->caught_stealing;
    }

    // 打率・出塁率を計算
    foreach ($grouped as &$player) {
      $player['avg'] = $player['at_bats'] > 0 ? round($player['hits'] / $player['at_bats'], 3) : 0;
      $player['obp'] = ($player['at_bats'] + $player['walks']) > 0
        ? round(($player['hits'] + $player['walks']) / ($player['at_bats'] + $player['walks']), 3)
        : 0;
    }

    $collection = collect($grouped);

    // 指標ごとにソートして上位5件を返す
    return [
      'avg' => $collection->sortByDesc('avg')->take($limit)->values()->all(),
      'obp' => $collection->sortByDesc('obp')->take($limit)->values()->all(),
      'hits' => $collection->sortByDesc('hits')->take($limit)->values()->all(),
      'home_runs' => $collection->sortByDesc('home_runs')->take($limit)->values()->all(),
      'rbis' => $collection->sortByDesc('rbis')->take($limit)->values()->all(),
      'caught_stealing' => $collection->sortByDesc('caught_stealing')->take($limit)->values()->all(),
    ];
  }

  // 投手ランキング（指標ごとにソート）
  public function getPitchingRanking($limit = 5)
  {
    // 全投手記録を取得（user情報も取得）
    $records = PitchingRecord::with('user')->get();

    $grouped = [];

    // 選手ごとの集計配列にまだ存在しない場合、初期値を作る
    foreach ($records as $record) {
      $userId = $record->user_id;
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
      $grouped[$userId]['strikeouts'] += $record->strikeouts;
      $grouped[$userId]['outs'] += $record->pitching_innings_outs;
      $grouped[$userId]['earned_runs'] += $record->earned_runs;

      if ($record->result === '勝利') {
        $grouped[$userId]['wins'] += 1;
      }
    }

    // 防御率を計算（ERA = 自責点 * 9 ÷ 投球回）
    foreach ($grouped as &$player) {
      $innings = $player['outs'] / 3; // アウト数からイニング換算
      $player['era'] = $innings > 0 ? round(($player['earned_runs'] * 9) / $innings, 2) : 0;
    }

    $collection = collect($grouped);

    return [
      'era' => $collection->sortBy('era')->take($limit)->values()->all(), // 小さい順
      'wins' => $collection->sortByDesc('wins')->take($limit)->values()->all(),
      'strikeouts' => $collection->sortByDesc('strikeouts')->take($limit)->values()->all(),
    ];
  }
}
