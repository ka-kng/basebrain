import { useEffect, useState, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import GameSummary from "../components/GameDetail/GameSummary";
import BatterCard from "../components/GameDetail/BatterCard";
import PitcherCard from "../components/GameDetail/PitcherCard";
import DeleteModal from "../components/DeleteModal";

// APIエンドポイント定義
const API = {
  games: "/api/games",
  batting: "/api/users/batter",
  pitching: "/api/users/pitcher",
};

// 共通ボタンスタイル
const buttonClass =
  "bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg shadow";

export default function GameDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [game, setGame] = useState(null);
  const [openBatters, setOpenBatters] = useState([]);
  const [openPitchers, setOpenPitchers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  // 試合データ取得
  useEffect(() => {
    const fetchGame = async () => {
      try {
        const res = await axios.get(`${API.games}/${id}`);
        setGame(res.data);
      } catch (err) {
        console.error(err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };
    fetchGame();
  }, [id]);

  // 詳細開閉トグル
  const toggleDetails = useCallback((id, openList, setOpenList) => {
    setOpenList((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  }, []);

  // 削除対象を設定してモーダル表示
  const confirmDelete = useCallback((type, recordId = null) => {
    setDeleteTarget({ type, id: recordId });
  }, []);

  // 共通削除処理
  const handleDeleteConfirmed = useCallback(async () => {
    if (!deleteTarget) return;

    const { type, id: recordId } = deleteTarget;

    try {
      if (type === "game") {
        await axios.delete(`${API.games}/${id}`);
        toast.success("試合を削除しました");
        navigate("/games/list");
      } else if (type === "batting") {
        await axios.delete(`${API.batting}/${recordId}`);
        setGame((prev) => ({
          ...prev,
          batting_records: prev.batting_records.filter((p) => p.id !== recordId),
        }));
        toast.success("野手成績を削除しました");
      } else if (type === "pitching") {
        await axios.delete(`${API.pitching}/${recordId}`);
        setGame((prev) => ({
          ...prev,
          pitching_records: prev.pitching_records.filter(
            (p) => p.id !== recordId
          ),
        }));
        toast.success("投手成績を削除しました");
      }
    } catch (err) {
      console.error(err);
      toast.error("削除に失敗しました");
    } finally {
      setDeleteTarget(null);
    }
  }, [deleteTarget, id, navigate]);

  const handleBack = () => {
    navigate("/games/list");
  };

  if (loading)
    return <p className="text-center py-10 text-gray-600">読み込み中...</p>;
  if (error)
    return <p className="text-center py-10 text-red-500">エラーが発生しました。</p>;

  return (
    <div className="mx-auto xl:max-w-4xl">
      <Toaster position="top-right" />

      {/* 戻る・編集・削除 */}

      <div className="flex justify-between">
        <button
          onClick={handleBack}
          className="text-gray-600 hover:text-black transition"
        >
          ← 戻る
        </button>
        <div className="space-x-2">
          <button
            onClick={() => navigate(`/records/game/${game.id}/edit`)}
            className={buttonClass}
          >
            試合を編集
          </button>
          <button
            onClick={() => confirmDelete("game")}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg shadow"
          >
            削除
          </button>
        </div>
      </div>

      {/* タイトル */}
      <h1 className="text-3xl font-bold mt-16 text-gray-800 border-b-2 border-green-500 inline-block pb-1">
        試合詳細
      </h1>

      <GameSummary game={game} />

      {/* 野手成績 */}
      <h2 className="text-xl font-bold mb-4 text-left">⚾ 野手成績</h2>
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 items-start">
        {game?.batting_records?.map((batter) => (
          <BatterCard
            key={batter.id}
            batter={batter}
            open={openBatters.includes(batter.id)}
            toggleOpen={() =>
              toggleDetails(batter.id, openBatters, setOpenBatters)
            }
            onDelete={() => confirmDelete("batting", batter.id)}
            navigate={navigate}
          />
        ))}
      </div>
      <div className="block text-right">
        <button
          onClick={() =>
            navigate("/records/batting", { state: { game_id: game.id } })
          }
          className={`${buttonClass} mt-5`}
        >
          + 野手を追加
        </button>
      </div>

      {/* 投手成績 */}
      <h2 className="text-xl font-bold mt-10 mb-4 text-left">⚾ 投手成績</h2>
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 items-start">
        {game?.pitching_records?.map((pitcher) => (
          <PitcherCard
            key={pitcher.id}
            pitcher={pitcher}
            open={openPitchers.includes(pitcher.id)}
            toggleOpen={() => toggleDetails(pitcher.id, openPitchers, setOpenPitchers)}
            onDelete={() => confirmDelete("pitching", pitcher.id)}
            navigate={navigate}
          />
        ))}
      </div>
      <div className="block text-right">
        <button
          onClick={() =>
            navigate("/records/pitching", { state: { game_id: game.id } })
          }
          className={`${buttonClass} mt-5`}
        >
          + 投手を追加
        </button>
      </div>

      {/* 削除確認モーダル */}
      {deleteTarget && (
        <DeleteModal
          type={deleteTarget.type}
          onCancel={() => setDeleteTarget(null)}
          onConfirm={handleDeleteConfirmed}
        />
      )}
    </div>
  );
}
