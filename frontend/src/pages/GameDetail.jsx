import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";


export default function GameDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [game, setGame] = useState(null);
  const [openBatterId, setOpenBatterId] = useState(null);
  const [openPitcherId, setOpenPitcherId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios.get(`/api/games/${id}`)
      .then(res => {
        setGame(res.data);
        setLoading(false);
      })
      .catch(err => {
        setError(err);
        setLoading(false);
      });
  }, [id]);

  const handleDelete = () => {
    if (!window.confirm('本当に削除しますか？')) return;

    axios.delete(`/api/games/${id}`)
      .then((res) => {
        if (res.status === 204) {
          alert("削除しました");
          navigate("/games/list");
        }
      })
      .catch(err => {
        console.error(err);
        alert("削除に失敗しました");
      });
  };

  const handleBack = () => navigate(-1);

  if (loading) return <p>読み込み中...</p>
  if (error) return <p>エラーが発生しました。</p>

  // アウト数をイニング数に変更
  const formatInnings = (outs) => {
    const full = Math.floor(outs / 3);
    const remainder = outs % 3;
    return remainder === 0 ? `${full}` : `${full} + ${remainder}/3`;
  };

  // 数値を小数第3位までにして先頭の0を削除
  const formatRate = (value, digits = 3) => {
    if (value === null || value === undefined || isNaN(value)) return "-";
    const str = value.toFixed(digits); // "0.333" など
    return str.startsWith("0") ? str.substring(1) : str; // "0.333" → ".333"
  };

  // 投手用（0 を残す）
  const formatRateForPitcher = (value, digits = 2) => {
    if (value === null || value === undefined || isNaN(value)) return "-";
    return value.toFixed(digits); // 例: "0.00", "3.27"
  };

  // 打率算出
  const calcBattingAverage = (hits, atBats) => {
    if (!atBats) return "-";
    return formatRate(hits / atBats);
  };

  // 出塁率
  const calcOnBasePercentage = (hits, walks, atBats) => {
    const denominator = atBats + walks;
    if (!denominator) return "-";
    return formatRate((hits + walks) / denominator);
  };

  // 盗塁成功率
  const calcStealPercentage = (steals, caught) => {
    const denominator = steals + caught;
    if (!denominator) return "-";
    return formatRate(steals / denominator);
  };

  // 防御率
  const calcERA = (earnedRuns, outs) => {
    if (!outs) return "-";
    const innings = outs / 3;
    return formatRateForPitcher((earnedRuns * 9) / innings, 2);
  };

  // 奪三振率
  const calcK9 = (strikeouts, outs) => {
    if (!outs) return "-";
    const innings = outs / 3;
    return formatRateForPitcher((strikeouts * 9) / innings, 2);
  };

  // 与四死球率
  const calcBB9 = (walks, outs) => {
    if (!outs) return "-";
    const innings = outs / 3;
    return formatRateForPitcher((walks * 9) / innings, 2);
  }

  return (
    <div className="px-5 pb-16 mx-auto max-w-screen-lg">
      <div className="flex justify-between">
        <button className="block text-left text-xl" onClick={handleBack}>戻る</button>
        <div className="mb-5 text-right">
          <button
            type="button"
            onClick={() => navigate(`/records/game/${game.id}/edit`)}
            className="block text-left text-xl"
          >
            試合の編集
          </button>
        </div>
      </div>

      <div className="block text-right">
        <button
          onClick={handleDelete}
          className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded"
        >試合結果を削除する</button>
      </div>

      <h1 className="font-bold text-2xl mt-10 text-left">試合詳細</h1>
      <div className="mt-10 text-left text-xl space-y-3">
        <p>{game.game_type}：{game.formatted_date}</p>
        <p>試合結果：{game.result}</p>
        <p>{game.team?.name}：{game.team_score}点</p>
        <p>{game.opponent}：{game.opponent_score}点</p>
        <div>
          <p>メモ：</p>
          <p>{game.memo}</p>
        </div>
      </div>

      {/* 野手成績 */}
      <div className="text-left mt-10">
        <h2 className="text-xl font-bold">野手成績</h2>

        {game?.batting_records?.length > 0 ? (
          game.batting_records.map((batter) => (
            <div key={batter.id} className="py-2 flex flex-col gap-10  border-b border-gray-500">
              <div>
                <button
                  type="button"
                  onClick={() => navigate(`/records/batting/${batter.id}/edit`)}
                  className="text-left text-sm text-blue-600 hover:underline"
                >
                  編集する
                </button>
                <p className="mt-3 font-semibold text-lg">選手名：{batter.user.name}</p>
                <p className="mt-3 font-semibold text-lg">守備位置：{batter.position}</p>
                <p className="mt-3 font-semibold text-lg">打順：{batter.order_no}番</p>
                <div className="flex flex-col">
                  <p className="mt-3 font-semibold text-lg xl:text-xl">
                    打率：{calcBattingAverage(batter.hits, batter.at_bats)}
                  </p>
                  <p className="mt-3 font-semibold text-lg xl:text-xl">
                    出塁率：{calcOnBasePercentage(batter.hits, batter.walks, batter.at_bats)}
                  </p>
                  <p className="mt-3 font-semibold text-lg xl:text-xl">
                    盗塁率：{calcStealPercentage(batter.steals, batter.caught_stealing)}
                  </p>
                </div>

                {/* スマホ用詳細表示 */}
                <div className="mt-5 flex flex-col text-left space-y-3">
                  <button
                    className="text-left text-sm text-blue-600 hover:underline"
                    onClick={() => setOpenBatterId(openBatterId === batter.id ? null : batter.id)}
                  >
                    {openBatterId === batter.id ? "詳細を閉じる" : "詳細を見る"}
                  </button>
                  {openBatterId === batter.id && (
                    <div className="mt-5 grid grid-cols-1 lg:grid-cols-3 gap-3">
                      <p className="text-xl">打席数： 【{batter.at_bats}】 打数</p>
                      <p className="text-xl">安打数： 【{batter.hits}】 安打</p>
                      <p className="text-xl">打点数： 【{batter.rbis}】 点</p>
                      <p className="text-xl">得点数： 【{batter.runs}】 点</p>
                      <p className="text-xl">四死球数： 【{batter.walks}】 回</p>
                      <p className="text-xl">三振数： 【{batter.strikeouts}】 回</p>
                      <p className="text-xl">盗塁数： 【{batter.steals}】 回</p>
                      <p className="text-xl">盗塁死数： 【{batter.caught_stealing}】 回</p>
                      <p className="text-xl">失策数： 【{batter.errors}】 回</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        ) : (
          <button
            type="button"
            onClick={() => navigate('/records/batting', { state: { game_id: game.id } })}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded mt-3"
          >
            未登録野手を新規登録
          </button>
        )}



      </div>

      {/* 投手成績 */}
      <div className="text-left mt-5">
        <h2 className="text-xl font-bold">投手成績</h2>

        {game && game.pitching_records.length > 0 ? (
          game.pitching_records.map((pitcher) => (
            <div key={pitcher.id} className="py-2 flex flex-col gap-10  border-b border-gray-500">
              <div>
                <button
                  type="button"
                  onClick={() => navigate(`/records/pitching/${pitcher.id}/edit`)}
                  className="text-left text-sm text-blue-600 hover:underline"
                >
                  編集する
                </button>
                <p className="mt-3 font-semibold text-lg">選手名：{pitcher.user.name}</p>
                <p className="mt-3 font-semibold text-lg">守備位置：{pitcher.result}</p>
                <p className="mt-3 font-semibold text-lg">投球イニング：{formatInnings(pitcher.pitching_innings_outs)}回</p>
                <div className="flex flex-col">
                  <p className="mt-3 font-semibold text-lg xl:text-xl">
                    防御率：{calcERA(pitcher.earned_runs, pitcher.pitching_innings_outs)}
                  </p>
                  <p className="mt-3 font-semibold text-lg xl:text-xl">
                    奪三振率：{calcK9(pitcher.strikeouts, pitcher.pitching_innings_outs)}
                  </p>
                  <p className="mt-3 font-semibold text-lg xl:text-xl">
                    与四死球率：{calcBB9(pitcher.walks_given, pitcher.pitching_innings_outs)}
                  </p>
                </div>

                {/* スマホ用詳細表示 */}
                <div className="mt-5 flex flex-col text-left space-y-3">
                  <button
                    className="text-left text-sm text-blue-600 hover:underline"
                    onClick={() => setOpenPitcherId(openPitcherId === pitcher.id ? null : pitcher.id)}
                  >
                    {openPitcherId === pitcher.id ? "詳細を閉じる" : "詳細を見る"}
                  </button>
                  {openPitcherId === pitcher.id && (
                    <div className="mt-5 grid grid-cols-1 lg:grid-cols-3 gap-3">
                      <p className="text-xl">投球数： 【{pitcher.pitches}】 球</p>
                      <p className="text-xl">奪三振数： 【{pitcher.strikeouts}】 回</p>
                      <p className="text-xl">被安打数： 【{pitcher.hits_allowed}】 本</p>
                      <p className="text-xl">被本塁打数： 【{pitcher.hr_allowed}】 本</p>
                      <p className="text-xl">四死球数： 【{pitcher.walks_given}】 回</p>
                      <p className="text-xl">失点数： 【{pitcher.earned_runs}】 点</p>
                      <p className="text-xl">自責点数： 【{pitcher.runs_allowed}】 点</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        ) : (
          <button
            type="button"
            onClick={() => navigate('/records/pitching', { state: { game_id: game.id } })}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded mt-3"
          >
            未登録投手を新規登録
          </button>
        )}

      </div>

    </div>
  )

}
