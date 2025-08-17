import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import axios from "axios";

export default function SummaryRecord() {
  const navigate = useNavigate();
  const [game, setGame] = useState(null);
  const [batters, setBatters] = useState([]);
  const [pitchers, setPitchers] = useState([]);

  const location = useLocation();
  const game_id = location.state?.game_id;

  useEffect(() => {

    if (!game_id) {
      navigate("/records/game");
      return;
    }

    axios.get(`/api/records/summary?game_id=${game_id}`)
      .then(res => {
        setGame(res.data.game);
        setBatters(res.data.batters);
        setPitchers(res.data.pitchers);
      })
      .catch(() => {
        navigate('/records/game');
      });
  }, [game_id, navigate]);

  if (!game) return <p>読み込み中...</p>

  return (
    <div className="px-10 pt-10 pb-20">
      <div className="flex justify-between">
        <button className="block text-left text-xl" onClick={() => navigate(-1)}>戻る</button>
        <div className="mb-5 text-right">
          <button
            type="button"
            onClick={() => navigate('/games/list')}
            className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded"
          >
            試合一覧へ
          </button>
        </div>
      </div>

      {/* 公式戦 */}
      <div className="flex justify-center mt-10">
        <div className="w-full max-w-4xl px-5 text-left">
          <h1 className="text-2xl text-center">登録結果まとめ</h1>

          <div className="mt-10 space-y-2">
            <span className="block">{game.game_type}：{game.date}</span>
            <span className="block">大会名：{game.tournament}</span>
            <span className="block">対戦相手：{game.opponent}</span>
            <span className="block">自チームスコア：{game.team_score}点</span>
            <span className="block">相手チームスコア：{game.opponent_score}点</span>
            <div className="flex flex-col">
              <span>メモ</span>
              <span>{game.memo}</span>
            </div>
          </div>

          <div className="mt-10">
            <h2>打撃登録選手</h2>
            <ul className="list-disc list-inside space-y-1">
              {batters.map((batter, i) => <li key={i}>{batter}</li>)}
            </ul>

            <div className="mt-10">
              <h2>投手登録選手</h2>
              <ul className="list-disc list-inside space-y-1">
                {pitchers.map((pitcher, i) => <li key={i}>{pitcher}</li>)}
              </ul>
            </div>
          </div>
        </div>
      </div>

    </div>
  );

}
