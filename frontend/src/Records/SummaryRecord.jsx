import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

// SummaryRecord コンポーネント
export default function SummaryRecord() {
  const navigate = useNavigate(); // ページ遷移用
  const location = useLocation(); // location.state 取得用
  const game_id = location.state?.game_id; // 直前ページから渡された game_id

  // ゲーム情報と打者・投手の状態管理
  const [game, setGame] = useState(null);
  const [batters, setBatters] = useState([]);
  const [pitchers, setPitchers] = useState([]);

  // 初回レンダー時にデータ取得
  useEffect(() => {
    if (!game_id) return navigate("/records/game"); // game_id がなければ試合一覧に戻す

    axios
      .get(`/api/records/summary?game_id=${game_id}`) // API 呼び出し
      .then((res) => {
        setGame(res.data.game); // 試合情報セット
        setBatters(res.data.batters); // 打者情報セット
        setPitchers(res.data.pitchers); // 投手情報セット
      })
      .catch(() => navigate("/records/game")); // エラー時は試合一覧に戻す
  }, [game_id, navigate]);

  if (!game) return <p className="text-center mt-10">読み込み中...</p>;

  // 勝敗に応じた背景色を設定
  const resultColor = {
    勝利: "bg-green-500",
    敗北: "bg-red-500",
    引き分け: "bg-yellow-500",
    "-": "bg-gray-400",
  }[game.result] || "bg-gray-400";

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <button
          onClick={() => navigate(-1)}
          className="text-gray-500 hover:text-gray-800 text-lg font-medium"
        >
          ← 戻る
        </button>
        <button
          type="button"
          onClick={() => navigate("/games/list")}
          className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded shadow"
        >
          試合一覧へ
        </button>
      </div>

      {/* Title */}
      <h1 className="text-3xl font-bold mt-8 text-gray-800 border-b-2 border-green-500 inline-block pb-1">
        登録結果
      </h1>

      <div className="bg-white rounded-2xl p-8 space-y-6">

        <div className="text-left grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-4 text-gray-700 max-w-xl mx-auto">
          {/* 左カラム */}
          <div className="space-y-2">
            <div className="flex">
              <span className="font-semibold w-24">試合種類：</span>
              <span>{game.game_type}</span>
            </div>
            <div className="flex items-center">
              <span className="font-semibold w-24">勝敗：</span>
              <span className={`text-white px-3 py-1 rounded-full text-sm font-semibold ${resultColor}`}>
                {game.result || "-"}
              </span>
            </div>
            <div className="flex">
              <span className="font-semibold w-24">大会名：</span>
              <span>{game.tournament}</span>
            </div>
          </div>

          {/* 右カラム */}
          <div className="space-y-2">
            <div className="flex">
              <span className="font-semibold w-24">日付：</span>
              <span>{game.date}</span>
            </div>
            <div className="flex">
              <span className="font-semibold w-24">スコア：</span>
              <span>{game.team_score} - {game.opponent_score}</span>
            </div>
            <div className="flex">
              <span className="font-semibold w-24">対戦相手：</span>
              <span>{game.opponent}</span>
            </div>
          </div>
        </div>

        {/* Memo */}
        {game.memo && (
          <div>
            <h2 className="font-semibold mb-1 text-left">メモ</h2>
            <p className="text-gray-600 text-left bg-gray-50 p-4 rounded-md border border-gray-200">{game.memo}</p>
          </div>
        )}

        {/* Batters */}
        <div>
          <h2 className="text-xl font-semibold border-b pb-2 mb-3">打撃登録選手</h2>
          {batters.length === 0 ? (
            <p className="text-gray-500">登録なし</p>
          ) : (
            <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {batters.map((batter, i) => (
                <li
                  key={i}
                  className="bg-green-50 p-3 rounded-xl shadow text-gray-800 font-medium text-center"
                >
                  {batter}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Pitchers */}
        <div>
          <h2 className="text-xl font-semibold border-b pb-2 mb-3">投手登録選手</h2>
          {pitchers.length === 0 ? (
            <p className="text-gray-500">登録なし</p>
          ) : (
            <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {pitchers.map((pitcher, i) => (
                <li
                  key={i}
                  className="bg-blue-50 p-3 rounded-xl shadow text-gray-800 font-medium text-center"
                >
                  {pitcher}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
