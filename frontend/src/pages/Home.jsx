import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../Auth/AuthContext";
import CenteredLayout from "../layout/Background";

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
    <CenteredLayout>
      <div className="max-w-4xl w-full text-center space-y-8">
        <h1 className="text-4xl xl:text-6xl font-bold tracking-wide">野球チーム管理アプリ Basebrain</h1>
        <p className="text-xl text-opacity-90">
          「Basebrain」へようこそ！<br />
          野球チームの試合結果、個人成績、選手ランキング、スケジュール管理を、シンプルかつ強力にサポートします。
        </p>

        <div className="flex justify-center gap-6 mt-8">
          <Link
            to="/register"
            className="bg-white text-teal-600 hover:bg-teal-600 hover:text-white px-8 py-4 rounded-lg shadow-xl transition ease-in-out duration-300"
          >
            新規登録
          </Link>
          <Link
            to="/login"
            className="bg-transparent border-2 border-white hover:bg-white hover:text-teal-600 px-8 py-4 rounded-lg shadow-xl transition ease-in-out duration-300"
          >
            ログイン
          </Link>
        </div>

        <div className="mt-16 space-y-12">
          <h2 className="text-3xl font-semibold">主な機能</h2>

          {/* 試合結果の記録・編集 */}
          <div className="text-left max-w-3xl mx-auto bg-white p-8 rounded-xl shadow-lg">
            <h3 className="text-2xl font-semibold text-teal-600">試合結果の記録・編集</h3>
            <p className="mt-4 text-lg text-gray-800">
              試合日、大会名、スコア、相手チーム名を入力するだけで、試合結果をスムーズに管理。後から簡単に編集・更新でき、チームの成績を一目で確認できます。
            </p>
          </div>

          {/* チーム成績管理 */}
          <div className="text-left max-w-3xl mx-auto bg-white p-8 rounded-xl shadow-lg">
            <h3 className="text-2xl font-semibold text-teal-600">チーム成績管理</h3>
            <p className="mt-4 text-lg text-gray-800">
              チームの試合結果から成績を自動で集計。個別の戦績を見える化し、チーム全体のパフォーマンスを管理できます。
            </p>
          </div>

          {/* 選手のバッティング・ピッチング成績管理 */}
          <div className="text-left max-w-3xl mx-auto bg-white p-8 rounded-xl shadow-lg">
            <h3 className="text-2xl font-semibold text-teal-600">選手の成績管理</h3>
            <p className="mt-4 text-lg text-gray-800">
              バッティング・ピッチングの詳細データを簡単に入力し、選手一人ひとりの成績をリアルタイムで更新。パフォーマンス分析がよりスムーズに。
            </p>
          </div>

          {/* 選手ランキング表示 */}
          <div className="text-left max-w-3xl mx-auto bg-white p-8 rounded-xl shadow-lg">
            <h3 className="text-2xl font-semibold text-teal-600">選手ランキング表示</h3>
            <p className="mt-4 text-lg text-gray-800">
              チームの選手ランキングを自動で表示。打撃・守備成績を基に、チーム内のランキングを一目で確認できます。
            </p>
          </div>

          {/* 試合スケジュールの管理 */}
          <div className="text-left max-w-3xl mx-auto bg-white p-8 rounded-xl shadow-lg">
            <h3 className="text-2xl font-semibold text-teal-600">試合スケジュールの管理</h3>
            <p className="mt-4 text-lg text-gray-800">
              試合の日程や場所、対戦相手を管理し、チーム全体で共有。試合の準備や移動もスムーズに行えます。
            </p>
          </div>
        </div>

      </div>
    </CenteredLayout>
  );
}
