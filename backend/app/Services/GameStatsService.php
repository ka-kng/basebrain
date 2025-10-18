<?php

// app/Services/GameStatsService.php
namespace App\Services;

use App\Models\Game;

class GameStatsService
{
    public function formatBatting($battingRecords)
    {
        return $battingRecords->map(function ($batter) {

            // 合計安打（単打＋二塁打＋三塁打＋本塁打）
            $totalHits = $batter->hits + $batter->doubles + $batter->triples + $batter->home_runs;

            // 打数
            $atBats = $batter->at_bats;

            // 打席（打数＋四死球）
            $plateAppearances = $atBats + $batter->walks;

            // 総塁打（単打＋二塁打*2＋三塁打*3＋本塁打*4）
            $totalBases = $batter->hits + $batter->doubles * 2 + $batter->triples * 3 + $batter->home_runs * 4;

            // 打率 = 合計安打 / 打数
            $battingAverage = $atBats ? round($totalHits / $atBats, 3) : 0;

            // 出塁率 = (合計安打 + 四死球) / 打席
            $onBasePercentage = $plateAppearances ? round(($totalHits + $batter->walks) / $plateAppearances, 3) : 0;

            // 盗塁成功率 = 盗塁 / (盗塁 + 盗塁死)
            $stealSuccessRate = $batter->steals
                ? round($batter->caught_stealing / $batter->steals, 3)
                : 0;

            // 長打率 = 総塁打 / 打数
            $slugging = $atBats ? round($totalBases / $atBats, 3) : 0;

            // OPS = 出塁率 + 長打率
            $ops = round($onBasePercentage + $slugging, 3);

            return [
                'id' => $batter->id,
                'user' => $batter->user ? [
                    'id' => $batter->user->id,
                    'name' => $batter->user->name,
                ] : null,
                'order_no' => $batter->order_no,
                'position' => $batter->position,
                'at_bats' => $batter->at_bats,
                'hits' => $batter->hits,
                'doubles' => $batter->doubles,
                'triples' => $batter->triples,
                'home_runs' => $batter->home_runs,
                'rbis' => $batter->rbis,
                'runs' => $batter->runs,
                'walks' => $batter->walks,
                'strikeouts' => $batter->strikeouts,
                'steals' => $batter->steals,
                'caught_stealing' => $batter->caught_stealing,
                'errors' => $batter->errors,

                // 計算済み指標
                'batting_average' => number_format($battingAverage, 3),       // 打率
                'on_base_percentage' => number_format($onBasePercentage, 3),  // 出塁率
                'steal_success_rate' => number_format($stealSuccessRate, 3),  // 盗塁成功率
                'slugging' => number_format($slugging, 3),                     // 長打率
                'ops' => number_format($ops, 3),                               // OPS
            ];
        });
    }

    public function formatPitching($pitchingRecords)
    {
        return $pitchingRecords->map(function ($pitcher) {

            // 投球アウト数
            $outs = $pitcher->pitching_innings_outs;

            // 回数表示（例：5+1/3）
            $formattedInnings = intdiv($outs, 3) . ($outs % 3 ? '+' . ($outs % 3) . '/3' : '');

            // 防御率 = 自責点 * 9 / 投球回
            $era = $outs ? round(($pitcher->earned_runs * 9) / ($outs / 3), 2) : 0;

            // 奪三振率 = 奪三振 * 9 / 投球回
            $k9 = $outs ? round(($pitcher->strikeouts * 9) / ($outs / 3), 2) : 0;

            // 与四死球率 = 与四死球 * 9 / 投球回
            $bb9 = $outs ? round(($pitcher->walks_given * 9) / ($outs / 3), 2) : 0;

            return [
                'id' => $pitcher->id,
                'user' => $pitcher->user ? [
                    'id' => $pitcher->user->id,
                    'name' => $pitcher->user->name,
                ] : null,
                'result' => $pitcher->result,
                'pitching_innings_outs' => $pitcher->pitching_innings_outs,
                'pitches' => $pitcher->pitches,
                'strikeouts' => $pitcher->strikeouts,
                'hits_allowed' => $pitcher->hits_allowed,
                'hr_allowed' => $pitcher->hr_allowed,
                'walks_given' => $pitcher->walks_given,
                'runs_allowed' => $pitcher->runs_allowed,
                'earned_runs' => $pitcher->earned_runs,

                // 計算済み指標
                'formatted_innings' => $formattedInnings,       // 投球回表示
                'era' => number_format($era, 2),                // 防御率
                'k9' => number_format($k9, 2),                  // 奪三振率
                'bb9' => number_format($bb9, 2),                // 与四死球率
            ];
        });
    }

    public function formatGame(Game $game)
    {
        return [
            'id' => $game->id,
            'formatted_date' => $game->date->format('Y-m-d (D)'),
            'game_type' => $game->game_type,
            'tournament' => $game->tournament,
            'result' => $game->result,
            'team_score' => $game->team_score,
            'opponent' => $game->opponent,
            'opponent_score' => $game->opponent_score,
            'memo' => $game->memo,
            'team' => ['name' => $game->team->name],

            // 野手成績・投手成績
            'batting_records' => $this->formatBatting($game->battingRecords),
            'pitching_records' => $this->formatPitching($game->pitchingRecords),
        ];
    }
}
