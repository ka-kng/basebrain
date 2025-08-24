import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function GameList() {
  const [games, setGames] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get("/api/games")
      .then(res => setGames(res.data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="max-w-screen-sm p-4 pb-16 mx-auto xl:max-w-screen-md">
      {/* 新規登録ボタン */}
      <div className="flex justify-end">
        <button
          type="button"
          onClick={() => navigate('/records/game')}
          className="bg-green-500 hover:bg-green-600 text-white py-2 px-6 rounded-lg shadow-md transition"
        >
          ＋ 新規登録
        </button>
      </div>

      {/* タイトル */}
      <h1 className="text-3xl font-bold mt-8 text-gray-800 border-b-2 border-green-500 inline-block pb-1">
        試合一覧
      </h1>

      {/* 試合リスト */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mt-8">
        {games.map((game) => (
          <div
            key={game.id}
            className="border rounded-xl shadow-md p-5 bg-white hover:shadow-xl transition transform hover:-translate-y-1"
          >
            {/* 日付 & 結果 */}
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-gray-500">{game.formatted_date}</span>
              <span
                className={`px-3 py-1 text-xs font-bold rounded-full bg-gray-100 text-gray-600"}`}
              >
                {game.game_type}
              </span>
            </div>

            {/* 大会情報 */}
            <h2 className="text-lg font-semibold text-gray-800">
              {game.tournament}
            </h2>
            <p className="text-sm text-gray-500 mb-3">試合結果：{game.result}</p>

            {/* スコア */}
            <div className="flex justify-between items-center bg-gray-50 rounded-lg p-3 mb-3">
              <div className="text-center flex-1">
                <p className="font-bold">{game.team?.name}</p>
                <p className="text-2xl font-bold text-green-600">{game.team_score}</p>
              </div>
              <span className="text-lg font-bold text-gray-500">vs</span>
              <div className="text-center flex-1">
                <p className="font-bold">{game.opponent}</p>
                <p className="text-2xl font-bold text-red-600">{game.opponent_score}</p>
              </div>
            </div>

            {/* メモ */}
            <p className="text-sm text-left text-gray-600 truncate mb-4">{game.memo}</p>

            {/* 詳細ボタン */}
            <button
              onClick={() => navigate(`/games/${game.id}`)}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-lg shadow-sm transition"
            >
              詳細を見る
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
