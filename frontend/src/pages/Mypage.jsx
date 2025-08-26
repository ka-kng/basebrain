import { useState, useEffect } from "react";
import axios from "axios";
import InputField from "../components/InputField";
import { motion } from "framer-motion";

// 削除確認モーダル
function ConfirmModal({ onConfirm, onCancel }) {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 p-4">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white p-6 rounded-2xl shadow-2xl w-full max-w-sm text-center"
      >
        <p className="text-lg mb-4">本当にアカウントを削除しますか？</p>
        <div className="flex gap-3 justify-center">
          <button
            onClick={onConfirm}
            className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-xl font-bold shadow-md transition"
          >
            削除
          </button>
          <button
            onClick={onCancel}
            className="bg-gray-200 hover:bg-gray-300 px-6 py-3 rounded-xl font-bold transition"
          >
            キャンセル
          </button>
        </div>
      </motion.div>
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
  const [errors, setErrors] = useState({});
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
    const newErrors = {};

    if (!name) newErrors.name = "名前を入力してください";
    if (!email) newErrors.email = "メールアドレスを入力してください";

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) return;
    try {
      const payload = { name, email };
      if (user.role === "coach") payload.team_name = teamName;
      if (password) payload.password = password;

      const res = await axios.put(`/api/mypage`, payload);
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
      await axios.delete(`/api/mypage`);
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
    <div className="p-5 pb-16 max-w-screen-md mx-auto">
      <h1 className="text-3xl font-bold text-gray-800 border-b-4 border-green-500 inline-block pb-2 mb-10">
        マイページ
      </h1>

      <form onSubmit={handleUpdate} className="text-left flex flex-col gap-4 mb-6">

        <InputField
          label="名前"
          inputName="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="名前を入力"
          error={errors?.name}
        />

        <InputField
          label="メールアドレス"
          type="email"
          inputName="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="example@example.com"
          error={errors?.email}
        />

        {user.role === "coach" && (
          <>
            <InputField
              label="チーム名"
              inputName="team_name"
              value={teamName}
              onChange={(e) => setTeamName(e.target.value)}
              placeholder="チーム名を入力"
              error={errors?.team_name}
            />


            <InputField
              label="招待コード"
              inputName="invite_code"
              value={inviteCode || "-"}
              disabled
            />

            <button
              type="button"
              onClick={handleCopyInviteLink}
              className="bg-green-600 text-white px-4 py-2 rounded-lg mt-2"
            >
              招待リンクをコピー
            </button>

          </>
        )}

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
