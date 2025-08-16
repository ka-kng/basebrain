import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";


export default function GameDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [game, setGame] = useState(null);
  const [showFullBatting, setShowFullBatting] = useState(false);
  const [showFullPitching, setShowFullPitching] = useState(false);
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

  const handleBack = () => navigate(-1);

  if (loading) return <p>読み込み中...</p>
  if (error) return <p>エラーが発生しました。</p>

  return (
    <div className="px-5 mx-auto max-w-screen-lg pb-16">
      <div className="flex justify-between">
        <button className="block text-left text-xl" onClick={handleBack}>戻る</button>
        <div className="mb-5 text-right">
          <button
            type="button"
            onClick={() => navigate(`/records/summary`, { state: { game_id: form.game_id } })}
            className="block text-left text-xl"
          >
            編集
          </button>
        </div>
      </div>

      <div className="block text-right">
        <button className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded">試合結果を削除する</button>
      </div>

      <h1 className="font-bold text-2xl mt-10 text-left">試合詳細</h1>
      <div className="mt-10 text-left text-xl space-y-3">
        <p>{game.game_type}：{game.formatted_date}</p>
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

        {game.batting_records.map((batter) => (
          <div key={batter.id} className="py-2 flex flex-col gap-10">
            <div>
              <p className="mt-3 font-semibold text-lg">選手名：{batter.user.name}</p>
              <p className="mt-3 font-semibold text-lg">守備位置：{batter.position}</p>
              <p className="lg:hidden mt-3 font-semibold text-lg">打順：{batter.order_no}番</p>
              <div className="hidden md:flex gap-5">
                <p className="mt-3 font-semibold text-lg">打率：{batter.position}</p>
                <p className="mt-3 font-semibold text-lg">出塁率：{batter.position}</p>
                <p className="mt-3 font-semibold text-lg">盗塁率：{batter.position}</p>
              </div>
              {/* PCテーブル表示 */}
              <table className="hidden lg:table mt-5 w-full border-collapse border border-gray-300">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border px-2 py-1">打順</th>
                    <th className="border px-2 py-1">打席</th>
                    <th className="border px-2 py-1">安打</th>
                    <th className="border px-2 py-1">打点</th>
                    <th className="border px-2 py-1">得点</th>
                    <th className="border px-2 py-1">四死球</th>
                    <th className="border px-2 py-1">三振</th>
                    <th className="border px-2 py-1">盗塁</th>
                    <th className="border px-2 py-1">盗塁死</th>
                    <th className="border px-2 py-1">失策</th>
                  </tr>
                </thead>
                <tbody>
                  {game.batting_records.map((batting) => (
                    <tr key={batting.id}>
                      <td className="border px-2 py-1">【{batting.order_no}】 番</td>
                      <td className="border px-2 py-1">【{batting.at_bats}】 打数</td>
                      <td className="border px-2 py-1">【{batting.hits}】 安打</td>
                      <td className="border px-2 py-1">【{batting.rbis}】 点</td>
                      <td className="border px-2 py-1">【{batting.runs}】 点</td>
                      <td className="border px-2 py-1">【{batting.walks}】 回</td>
                      <td className="border px-2 py-1">【{batting.strikeouts}】 回</td>
                      <td className="border px-2 py-1">【{batting.steals}】 回</td>
                      <td className="border px-2 py-1">【{batting.caught_stealing}】 回</td>
                      <td className="border px-2 py-1">【{batting.errors}】 回</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="lg:hidden mt-5 flex gap-3 md:gap-10">
                <p className="text-xl">打率：</p>
                <p className="text-xl">出塁率：</p>
                <p className="text-xl">盗塁率：</p>
              </div>

              {/* スマホ用詳細表示 */}
              <div className="mt-5 flex flex-col text-left gap-3 lg:hidden">
                <button className="text-left text-sm text-blue-600 hover:underline" onClick={() => setShowFullBatting(!showFullBatting)}>
                  {showFullBatting ? "詳細を閉じる" : "詳細を見る"}
                </button>
                {showFullBatting && (
                  <div>
                    {game.batting_records.map((batting) => (
                      <div key={batting.id} className="lg:hidden mt-5 flex flex-col gap-3">
                        <p className="text-xl">打席数： 【{batting.at_bats}】 打数</p>
                        <p className="text-xl">安打数： 【{batting.hits}】 安打</p>
                        <p className="text-xl">打点数： 【{batting.rbis}】 点</p>
                        <p className="text-xl">得点数： 【{batting.runs}】 点</p>
                        <p className="text-xl">四死球数： 【{batting.walks}】 回</p>
                        <p className="text-xl">三振数： 【{batting.strikeouts}】 回</p>
                        <p className="text-xl">盗塁数： 【{batting.steals}】 回</p>
                        <p className="text-xl">盗塁死数： 【{batting.caught_stealing}】 回</p>
                        <p className="text-xl">失策数： 【{batting.errors}】 回</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

    </div>
  )

}
