import { useState, useEffect } from "react";
import axios from "axios";

// 削除確認モーダル
function ConfirmModal({ onConfirm, onCancel }) {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 p-4">
      <div className="bg-white p-5 rounded-lg shadow-lg w-full max-w-xs sm:max-w-sm text-center">
        <p className="text-lg mb-4">本当にアカウントを削除しますか？</p>
        <div className="flex gap-3 justify-center">
          <button
            onClick={onConfirm}
            className="bg-red-600 text-white px-5 py-3 rounded-lg font-bold"
          >
            削除
          </button>
          <button
            onClick={onCancel}
            className="bg-gray-300 px-5 py-3 rounded-lg font-bold"
          >
            キャンセル
          </button>
        </div>
      </div>
    </div>
  );
}

export default function MyPage() {
  const [user, setUser] = useState(null);
  const [teamName, setTeamName] = useState("");
  const [inviteCode, setInviteCode] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get("/api/mypage");
        setUser(res.data);
        setName(res.data.name || "");
        setEmail(res.data.email || "");
        setTeamName(res.data.team_name || "");
        setInviteCode(res.data.invite_code || "");
      } catch (err) {
        console.error(err);
      }
    };
    fetchUser();
  }, []);

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const payload = { name, email };
      if (user.role === "coach") payload.team_name = teamName;
      if (password) payload.password = password;

      const res = await axios.put(`/api/mypage/${user.id}`, payload);
      setUser(res.data);
      setPassword("");
      alert("更新しました");
    } catch (err) {
      console.error(err);
      alert("更新に失敗しました");
    }
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`/api/mypage/${user.id}`);
      alert("アカウントを削除しました");
      window.location.href = "/";
    } catch (err) {
      console.error(err);
      alert("削除に失敗しました");
    }
  };

  // 招待リンクをコピーする処理
  const handleCopyInviteLink = () => {
    if (!inviteCode) return;
    const inviteUrl = `${window.location.origin}/register?invite=${inviteCode}`;
    navigator.clipboard.writeText(inviteUrl)
      .then(() => alert("招待リンクをコピーしました"))
      .catch(() => alert("コピーに失敗しました"));
  };

  if (!user) return null;

  return (
    <div className="p-5 max-w-screen-md mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-center">マイページ</h1>

      <form onSubmit={handleUpdate} className="text-left flex flex-col gap-4 mb-6">
        {user.role === "coach" && (
          <>
            <div className="flex flex-col">
              <label className="text-lg font-semibold mb-1">チーム名</label>
              <input
                value={teamName}
                onChange={(e) => setTeamName(e.target.value)}
                placeholder="チーム名を入力"
                className="border rounded-lg p-3 text-lg"
              />
            </div>

            <div className="flex flex-col">
              <label className="text-lg font-semibold mb-1">招待コード</label>
              <input
                value={inviteCode || "-"}
                disabled
                className="border rounded-lg p-3 text-lg bg-gray-100 cursor-not-allowed"
              />
              <button
                type="button"
                onClick={handleCopyInviteLink}
                className="bg-green-600 text-white px-4 py-2 rounded-lg mt-2"
              >
                招待リンクをコピー
              </button>
            </div>
          </>
        )}

        <div className="flex flex-col">
          <label className="text-lg font-semibold mb-1">名前</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="名前を入力"
            className="border rounded-lg p-3 text-lg"
          />
        </div>

        <div className="flex flex-col">
          <label className="text-lg font-semibold mb-1">メールアドレス</label>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="メールアドレスを入力"
            className="border rounded-lg p-3 text-lg"
            type="email"
          />
        </div>

        <div className="flex flex-col">
          <label className="text-lg font-semibold mb-1">パスワード</label>
          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="変更する場合は入力"
            className="border rounded-lg p-3 text-lg"
            type="password"
          />
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white text-lg font-bold py-3 rounded-lg mt-2"
        >
          更新
        </button>
      </form>

      {user.role !== "coach" && (
        <>
          <button
            onClick={() => setShowModal(true)}
            className="bg-red-600 text-white text-lg font-bold py-3 rounded-lg w-full"
          >
            アカウント削除
          </button>

          {showModal && (
            <ConfirmModal
              onConfirm={handleDelete}
              onCancel={() => setShowModal(false)}
            />
          )}
        </>
      )}
    </div>
  );
}
