import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import axios from "axios";

export default function GameList() {
  const [games, setGames] = useState([]);
  const navigate = useNavigate();

  const handleBack = () => {
    navigate(-1);
  };

  useEffect(() => {
    axios.get("/api/games/list")
      .then(res => setGames(res.data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="p-4 mx-auto max-w-screen-lg">
      <div className="flex justify-end ">
          <div className="mb-5 text-right">
            <button
              type="button"
              onClick={() => navigate('/records/game')}
              className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded"
            >
              新規登録
            </button>
          </div>
      </div>
      <h1 className="text-2xl mt-10 text-left">試合一覧</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left mt-10">
        {games.map((game) => (
          <div key={game.id} className="border rounded-lg shadow p-4 bg-white hover:shadow-lg transition">
            <p className="font-bold">{game.formatted_date}</p>
            <p className="font-bold">大会名：{game.tournament}</p>
            <p className="font-bold">大会種類：{game.game_type}</p>
            <p className="font-bold">{game.team?.name}： {game.team_score}点</p>
            <p className="font-bold">{game.opponent}：{game.opponent_score}点</p>
            <p className="font-bold truncate">メモ：{game.memo}</p>
            <button className="mt-3" onClick={() => navigate(`/games/${game.id}`)}>
              【 詳細を見る 】
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
