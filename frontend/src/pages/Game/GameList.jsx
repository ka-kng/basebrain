import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Button from "../../components/Button/Button";

// GameListコンポーネント本体
export default function GameList() {
  const [games, setGames] = useState([]); // 試合一覧データを保存するstate
  const navigate = useNavigate(); // ページ遷移用のnavigate関数

  // 一度だけ試合データを取得
  useEffect(() => {
    axios.get("/api/games") // APIから試合一覧を取得
      .then(res => setGames(res.data)) // 成功したらstateに保存
      .catch(err => console.error(err)); // エラーがあればコンソールに表示
  }, []); // 空配列で初回レンダー時のみ実行

  return (
    <div className="max-w-screen-sm mx-auto xl:max-w-screen-md">
      {/* 新規登録ボタン */}
      <div className="flex justify-end">
        <Button type="button" className="bg-green-600" onClick={() => navigate('/records/game')}>
          +新規登録
        </Button>
      </div>

      {/* タイトル */}
      <h1 className="text-3xl font-bold mt-8 text-gray-800 border-b-2 border-green-500 inline-block pb-1">
        試合一覧
      </h1>

      {/* 試合リスト */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mt-8">
        {games.map((game) => ( // games配列をループしてカードを生成
          <div
            key={game.id}
            className="flex flex-col h-full border rounded-xl shadow-md p-5 bg-white hover:shadow-xl transition transform hover:-translate-y-1"
          >
            {/* 日付 & 結果 */}
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-gray-500">{game.formatted_date}</span>
              <span className="px-3 py-1 text-xs font-bold rounded-full bg-gray-100 text-gray-600">
                {game.game_type}
              </span>
            </div>

            {/* 大会情報 */}
            <h2 className="text-lg font-semibold text-gray-800">{game.tournament}</h2>
            <p className="text-sm text-gray-500 mb-3">試合結果：{game.result}</p>

            {/* スコア */}
            <div className="flex justify-between bg-gray-50 rounded-lg p-3 mb-3 flex-1">
              <div className="flex-1 text-center flex flex-col justify-center">
                <p className="font-bold break-all">{game.team?.name}</p>
                <p className="text-2xl font-bold text-green-600">{game.team_score}</p>
              </div>
              <span className="text-lg font-bold text-gray-500 self-center">vs</span>
              <div className="flex-1 text-center flex flex-col justify-center">
                <p className="font-bold break-all">{game.opponent}</p>
                <p className="text-2xl font-bold text-red-600">{game.opponent_score}</p>
              </div>
            </div>

            {/* メモ */}
            <p className="text-sm text-left text-gray-600 mb-4">{game.memo}</p>

            {/* 詳細ボタン */}
            <Button type="button" className="bg-blue-500" onClick={() => navigate(`/games/${game.id}`)}>
              詳細を見る
            </Button>

          </div>
        ))}
      </div>

    </div>
  );
}
