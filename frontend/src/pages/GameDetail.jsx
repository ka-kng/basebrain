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
const buttonClass ="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg shadow";

// GameDetailコンポーネント本体
export default function GameDetail() {
  const { id } = useParams(); // URLパラメータのidを取得
  const navigate = useNavigate(); // ページ遷移用のnavigate関数

  const [game, setGame] = useState(null);
  const [openBatters, setOpenBatters] = useState([]); // 野手詳細開閉
  const [openPitchers, setOpenPitchers] = useState([]); // 投手詳細開閉
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  // 試合データ取得
  useEffect(() => {
    const fetchGame = async () => {
      try {
        const res = await axios.get(`${API.games}/${id}`); // APIから試合データを取得
        setGame(res.data); // stateに保存
      } catch (err) {
        console.error(err); // エラーをコンソールに表示
        setError(err); // stateにエラーを保存
      } finally {
        setLoading(false); // 読み込み終了
      }
    };
    fetchGame(); // データ取得を実行
  }, [id]); // idが変わったら再実行

  // 詳細開閉トグル
  const toggleDetails = useCallback((id, openList, setOpenList) => {
    // クリックしたidが既に開かれているか判定して追加/削除
    setOpenList((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  }, []);

  // 削除対象を設定してモーダル表示
  const confirmDelete = useCallback((type, recordId = null) => {
    setDeleteTarget({ type, id: recordId }); // type: game/batting/pitching, id: 該当レコードID
  }, []);

  // 削除確定後の処理
  const handleDeleteConfirmed = useCallback(async () => {
    if (!deleteTarget) return; // 対象がなければ何もしない

    const { type, id: recordId } = deleteTarget; // typeとidを取得

    try {
      // 試合自体を削除
      if (type === "game") {
        await axios.delete(`${API.games}/${id}`);
        toast.success("試合を削除しました");
        navigate("/games/list");

      } else if (type === "batting") {
        // 野手成績を削除
        await axios.delete(`${API.batting}/${recordId}`);
        setGame((prev) => ({  // stateを更新してUIから削除
          ...prev,
          batting_records: prev.batting_records.filter((p) => p.id !== recordId),
        }));
        toast.success("野手成績を削除しました");

      } else if (type === "pitching") {
        // 投手成績を削除
        await axios.delete(`${API.pitching}/${recordId}`);
        setGame((prev) => ({ // stateを更新してUIから削除
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
      setDeleteTarget(null); // モーダルを閉じる
    }
  }, [deleteTarget, id, navigate]);

  // 戻るボタン用
  const handleBack = () => {
    navigate("/games/list");
  };

  if (loading)
    return <p className="text-center py-10 text-gray-600">読み込み中...</p>;
  if (error)
    return <p className="text-center py-10 text-red-500">エラーが発生しました。</p>;

  // メイン描画
  return (
    <div className="mx-auto xl:max-w-4xl">
      {/* 通知表示 */}
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
