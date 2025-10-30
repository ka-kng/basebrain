import { useState, useEffect } from "react";
import axios from "axios";
import InputField from "../components/InputField"; // フォーム用モーダルコンポーネント
import DeleteModal from "../components/DeleteModal"; // アカウント削除用モーダルコンポーネント

export default function MyPage() {
  const [user, setUser] = useState(null);
  const [teamName, setTeamName] = useState("");
  const [inviteCode, setInviteCode] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState({});
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get("/mypage");
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

  // ユーザー情報更新
  const handleUpdate = async (e) => {
    e.preventDefault();
    const newErrors = {};

    // フロント側バリデーション
    if (!name) newErrors.name = "名前を入力してください";
    if (!email) newErrors.email = "メールアドレスを入力してください";

    setErrors(newErrors);

    // エラーがあれば送信中止
    if (Object.keys(newErrors).length > 0) return;

    try {
      const payload = { name, email };
      if (user.role === "coach") payload.team_name = teamName; // ユーザーがcoachの場合、チーム名も送信

      const res = await axios.put(`/mypage`, payload);
      setUser(res.data);
      alert("更新しました");
    } catch (err) {
      console.error(err);
      alert("更新に失敗しました");
    }
  };

  // アカウント削除処理
  const handleDelete = async () => {
    try {
      await axios.delete(`/mypage`);
      alert("アカウントを削除しました");
      window.location.href = "/";
    } catch (err) {
      console.error(err);
      alert("削除に失敗しました");
    }
  };

  // 招待リンクをコピーする処理(coachのみ表示)
  const handleCopyInviteLink = () => {
    if (!inviteCode) return;
    const inviteUrl = `${window.location.origin}/register?invite=${inviteCode}`;
    navigator.clipboard.writeText(inviteUrl);
  };

  // データ未取得時は何も表示しない
  if (!user) return null;

  return (
    <div className="max-w-screen-md mx-auto">
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
            <DeleteModal
              onConfirm={handleDelete}     // 削除処理
              onCancel={() => setShowModal(false)} // モーダルを閉じる
            />
          )}
        </>
      )}
    </div>
  );
}
