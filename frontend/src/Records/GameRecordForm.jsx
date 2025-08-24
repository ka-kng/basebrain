import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import InputField from "../components/InputField";

export default function GameRecordForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [form, setForm] = useState({
    date: "",
    game_type: "",
    tournament: "",
    opponent: "",
    team_score: "",
    opponent_score: "",
    memo: "",
    result: "",
  });

  // 編集時: 試合情報取得
  useEffect(() => {
    if (!id) return;
    setLoading(true);
    axios.get(`/api/games/${id}`)
      .then(res => {
        const data = res.data;
        setForm({
          date: data.date ? data.date.split("T")[0] : "",
          game_type: data.game_type,
          tournament: data.tournament,
          opponent: data.opponent,
          team_score: data.team_score,
          opponent_score: data.opponent_score,
          memo: data.memo,
          result: data.result,
        });
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  // 勝敗自動判定
  useEffect(() => {
    const team = parseInt(form.team_score, 10);
    const opp = parseInt(form.opponent_score, 10);
    if (!isNaN(team) && !isNaN(opp)) {
      setForm(prev => ({
        ...prev,
        result: team > opp ? "勝利" : team < opp ? "敗北" : "引き分け",
      }));
    }
  }, [form.team_score, form.opponent_score]);

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleBack = () => navigate(-1);

  const handleSubmit = async e => {
    e.preventDefault();
    const newErrors = {};
    if (!form.date) newErrors.date = "試合日を入力してください";
    if (!form.game_type) newErrors.game_type = "試合種類を選択してください";
    if (!form.tournament) newErrors.tournament = "大会名を入力してください";
    if (!form.opponent) newErrors.opponent = "相手チーム名を入力してください";
    if (form.team_score === "" || isNaN(form.team_score)) newErrors.team_score = "自チームのスコアを正しく入力してください";
    if (form.opponent_score === "" || isNaN(form.opponent_score)) newErrors.opponent_score = "相手チームのスコアを正しく入力してください";
    if (Object.keys(newErrors).length) return setErrors(newErrors);

    setErrors({});
    try {
      if (id) {
        await axios.put(`/api/games/${id}`, form);
        toast.success("試合を更新しました");
        navigate(`/games/${id}`);
      } else {
        const res = await axios.post("/api/games", form);
        toast.success("試合を登録しました");
        navigate("/records/batting", { state: { game_id: res.data.id } });
      }
    } catch (err) {
      console.error(err);
      toast.error("登録に失敗しました");
    }
  };

  if (loading) return <p className="text-center py-10 text-gray-500">読み込み中...</p>;

  return (
    <div className="max-w-4xl mx-auto p-6 pb-16">
      <Toaster position="top-right" />
      <div className="text-left">
        <button onClick={handleBack} className="text-gray-500 hover:text-gray-800 mb-4">← 戻る</button>
      </div>

      <h1 className="text-3xl font-bold mt-5 mb-10 text-gray-800 border-b-2 border-green-500 inline-block pb-1">
        {id ? "試合編集" : "新規試合登録"}
      </h1>

      <div className="bg-white shadow-lg rounded-xl p-8 text-left">
        <form onSubmit={handleSubmit} className="space-y-6">

          {/* 試合日 */}
          <InputField
            label="試合日"
            type="date"
            value={form.date}
            onChange={handleChange}
            inputName="date"
            error={errors.date}
          />

          {/* 試合種類 */}
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">試合種類</label>
            <div className="flex gap-6">
              {["公式戦", "練習試合"].map(type => (
                <label key={type} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="game_type"
                    value={type}
                    checked={form.game_type === type}
                    onChange={handleChange}
                    className="accent-blue-500"
                  />
                  {type}
                </label>
              ))}
            </div>
            {errors.game_type && <p className="text-red-500 text-sm mt-1">{errors.game_type}</p>}
          </div>

          {/* 大会名 */}
          <InputField
            label="大会名"
            value={form.tournament}
            onChange={handleChange}
            inputName="tournament"
            error={errors.tournament}
          />

          {/* 相手チーム */}
          <InputField
            label="相手チーム名"
            value={form.opponent}
            onChange={handleChange}
            inputName="opponent"
            error={errors.opponent}
          />

          {/* スコア */}
          <div>
            <label className="block font-medium mb-1">スコア</label>
            <div className="flex items-center gap-4">
              <InputField
                inputName="team_score"
                value={form.team_score}
                onChange={handleChange}
                placeholder="自チーム"
                error={errors.team_score}
              />
              <span className="font-bold">対</span>
              <InputField
                inputName="opponent_score"
                value={form.opponent_score}
                onChange={handleChange}
                placeholder="相手"
                error={errors.opponent_score}
              />
            </div>
          </div>

          {/* 勝敗 */}
          <div>
            <label className="block font-medium mb-1">試合結果</label>
            <p className="text-center py-2 border rounded-md bg-gray-50">{form.result || "-"}</p>
          </div>

          {/* メモ */}
          <div>
            <label className="block font-medium mb-1">
              メモ
            </label>
            <textarea
              name="memo"
              value={form.memo}
              onChange={handleChange}
              rows={5}
              className="w-full border rounded-md p-2" />
          </div>



          {/* 送信ボタン */}
          <div className="text-center">
            <button
              type="submit"
              className="w-40 bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-lg transition-all"
            >
              {id ? "更新する" : "打撃登録へ"}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
