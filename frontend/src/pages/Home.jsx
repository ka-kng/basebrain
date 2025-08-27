import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export default function Home() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && user) {
      // ログイン済みならマイページにリダイレクト
      navigate("/mypage");
    }
  }, [user, loading, navigate]);

  if (loading || user) {
    // 読み込み中またはリダイレクト処理中は何も表示しない
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 px-4">
      <div className="max-w-4xl w-full text-center space-y-8">
        <h1 className="text-5xl font-bold text-gray-800">Basebrain</h1>
        <p className="text-gray-700 text-lg">
          野球チーム管理アプリ「Basebrain」へようこそ！
          試合結果の記録、選手ランキング、スケジュール管理など、チーム運営を簡単に。
        </p>

        <div className="flex justify-center gap-4">
          <Link
            to="/register"
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg shadow font-medium transition"
          >
            新規登録
          </Link>
          <Link
            to="/login"
            className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-6 py-3 rounded-lg shadow font-medium transition"
          >
            ログイン
          </Link>
        </div>

        <div className="mt-12 text-left">
          <h2 className="text-2xl font-semibold mb-4">主な機能</h2>
          <ul className="list-disc list-inside text-gray-700 space-y-2">
            <li>試合結果の記録・編集</li>
            <li>選手のバッティング・ピッチング成績管理</li>
            <li>チーム・選手ランキング表示</li>
            <li>試合スケジュールの管理</li>
            <li>マイページで個人情報確認</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
