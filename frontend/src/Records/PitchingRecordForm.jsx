import { useEffect, useState, useMemo } from "react";
import axios from "axios";
import { useLocation, useNavigate, useParams } from "react-router-dom";

// 子コンポーネント: NumberInput 数値入力フォームをまとめて共通化したもの
const NumberInput = ({ label, name, value, onChange, unit, error }) => (
  <div className="flex flex-col gap-1">
    <div className="flex items-center justify-between">
      <label htmlFor={name} className="">{label}</label>
      <div className="flex items-center gap-2">
        <input
          id={name}
          name={name}
          type="number"
          min={0}
          value={value}
          onChange={onChange}
          className={`w-20 border p-2 rounded text-center ${error ? "border-red-500" : ""}`}
          aria-invalid={!!error}
        />
        <span className="text-gray-600">{unit}</span>
      </div>
    </div>
    {error && <p className="text-left text-red-500 text-sm mt-1">{error}</p>}
  </div>
);

// 子コンポーネント: 投球回数セレクト
const InningsSelect = ({ value, onChange, error }) => (
  <>
    <select
      id="pitching_innings_outs"
      name="pitching_innings_outs"
      value={value}
      onChange={onChange}
      className={`border p-2 rounded w-full ${error ? "border-red-500" : ""}`}
      aria-invalid={!!error}
    >
      <option value="">選択</option>
      {Array.from({ length: 36 }, (_, i) => {
        const full = Math.floor(i / 3);
        const third = (i % 3) + 1;
        const label = third === 3 ? `${full + 1}` : `${full} ${third}/3`;
        return <option key={i} value={i + 1}>{label}</option>;
      })}
    </select>
    {error && <p className="text-left text-red-500 text-sm mt-1">{error}</p>}
  </>
);

export default function PitchingRecordForm() {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();
  const isEdit = !!id;

  const [form, setForm] = useState({
    game_id: "",
    user_id: "",
    result: "",
    pitching_innings_outs: "",
    pitches: "",
    strikeouts: "",
    hits_allowed: "",
    hr_allowed: "",
    walks_given: "",
    runs_allowed: "",
    earned_runs: "",
  });

  // 選手一覧と登録済み投手
  const [users, setUsers] = useState([]);
  const [registeredPitchers, setRegisteredPitchers] = useState([]);
  const [errors, setErrors] = useState({});

  // 数値入力フィールド定義
  const numberFields = [
    { key: "pitches", label: "投球数", unit: "球" },
    { key: "strikeouts", label: "奪三振", unit: "回" },
    { key: "hits_allowed", label: "被安打", unit: "本" },
    { key: "hr_allowed", label: "被本塁打", unit: "本" },
    { key: "walks_given", label: "四死球", unit: "回" },
    { key: "runs_allowed", label: "失点", unit: "点" },
    { key: "earned_runs", label: "自責点", unit: "点" },
  ];

  // 選手一覧取得
  const fetchUsers = async () => {
    try {
      const res = await axios.get("/api/users/pitcher");
      setUsers(res.data);
    } catch (err) {
      console.error("Failed to fetch users:", err);
      setUsers([]);
    }
  };

  // すでに投手成績登録済みの選手IDを取得
  const fetchRegisteredUserIds = async (gameId = form.game_id) => {
    if (!gameId) return;
    try {
      const res = await axios.get(`/api/records/pitching/registered-users?game_id=${gameId}`);
      setRegisteredPitchers(res.data);
    } catch (err) {
      console.error("Failed to fetch registered pitchers:", err);
      setRegisteredPitchers([]);
    }
  };

  useEffect(() => { fetchUsers(); }, []);

  // game_id取得と登録済み投手取得
  useEffect(() => {
    const gameIdFromState = location.state?.game_id;
    if (!isEdit && !gameIdFromState) return navigate("/records/game");
    if (gameIdFromState) {
      setForm(prev => ({ ...prev, game_id: gameIdFromState }));
      fetchRegisteredUserIds(gameIdFromState);
    }
  }, [location.state, navigate, isEdit]);

  // 編集モード時：既存データを取得してフォームにセット
  useEffect(() => {
    if (!isEdit) return;
    axios.get(`/api/records/pitching/${id}`)
      .then(res => { setForm(res.data); fetchRegisteredUserIds(res.data.game_id); })
      .catch(err => { console.error(err); alert("データの取得に失敗しました"); });
  }, [id, isEdit]);

  const handleChange = e => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const validateForm = () => {
    const newErrors = {};
    if (!form.user_id) newErrors.user_id = "選手を選択してください";
    if (!form.result) newErrors.result = "勝敗を選択してください";
    if (!form.pitching_innings_outs) newErrors.pitching_innings_outs = "投球回数を選択してください";
    numberFields.forEach(f => {
      if (form[f.key] === "" || isNaN(form[f.key])) newErrors[f.key] = "数字を入力してください";
    });
    return newErrors;
  };

  // 登録・更新API呼び出し
  const submitForm = async () => {
    try {
      if (isEdit) {
        await axios.put(`/api/records/pitching/${id}`, form);
        navigate(`/games/${form.game_id}`);
      } else {
        await axios.post("/api/records/pitching", form);
      }
    } catch (err) {
      console.error("Submit failed:", err);
      throw err;
    }
  };

  // 続けて登録用にフォーム初期化
  const resetFormForContinue = () => {
    setForm(prev => ({ ...Object.fromEntries(Object.keys(prev).map(k => [k, ""])), game_id: prev.game_id }));
    fetchRegisteredUserIds();
  };

  // 送信ボタン押下時
  const handleSubmit = async (e, action) => {
    e.preventDefault();
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length) {
      setErrors(validationErrors);
      return;
    }
    setErrors({});
    try {
      await submitForm();
      if (!isEdit) {
        if (action === "continue") resetFormForContinue();
        else if (action === "summary") navigate("/records/summary", { state: { game_id: form.game_id } });
      }
    } catch {
      setErrors({ general: "通信エラーが発生しました" });
    }
  };

  // 登録済みの選手を除外して選択肢に出す
  // メモ化して不要な再計算を防ぐ
  const selectableUsers = useMemo(() => {
    // users 配列をフィルターして「選択可能な選手だけ」を返す
    return users.filter(u =>
      isEdit
        // 編集モードの場合：
        // u.id === form.user_id → 編集中の選手は残す
        // !registeredPitchers.includes(u.id) → 登録済みでない選手だけ残す
        ? u.id === form.user_id || !registeredPitchers.includes(u.id)
        // 新規登録モードの場合：
        // 登録済み選手は除外
        : !registeredPitchers.includes(u.id)
    );
    // useMemo の依存配列
    // users / registeredPitchers / form.user_id / isEdit が変わったときだけ再計算
  }, [users, registeredPitchers, form.user_id, isEdit]);

  // 残り1人だけなら「続けて登録」ボタンを非表示にする
  const MINIMUM_SELECTABLE_USERS = 1;
  const onlyOnePlayerLeft = selectableUsers.length === MINIMUM_SELECTABLE_USERS;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <button onClick={() => navigate(-1)} className="text-gray-500 hover:text-gray-800 text-lg">← 戻る</button>
        {!isEdit && registeredPitchers.length > 0 && (
          <button
            onClick={() => navigate("/records/summary", { state: { game_id: form.game_id } })}
            className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded shadow"
          >
            次へ
          </button>
        )}
      </div>

      <h1 className="text-3xl font-bold text-gray-800 border-b-2 border-green-500 inline-block pb-1">
        投手成績 {isEdit ? "編集" : "登録"}
      </h1>

      {/* Form */}
      <div className="bg-white rounded-xl shadow-lg p-8 space-y-6">
        <form className="space-y-6">
          {/* 選手・勝敗・投球回数 */}
          <div className="text-left grid grid-cols-1 xl:grid-cols-3 gap-4">
            {/* 選手 */}
            <div className="flex flex-col">
              <label className="mb-1 font-medium">選手名</label>
              <select
                name="user_id"
                value={form.user_id}
                onChange={handleChange}
                className={`border p-2 rounded w-full ${errors.user_id ? "border-red-500" : ""}`}
                aria-invalid={!!errors.user_id}
              >
                <option value="">選択してください</option>
                {selectableUsers.map(u => <option key={u.id} value={u.id}>{u.name}</option>)}
              </select>
              {errors.user_id && <p className="text-left text-red-500 text-sm mt-1">{errors.user_id}</p>}
            </div>

            {/* 勝敗 */}
            <div className="flex flex-col">
              <label className="mb-1 font-medium">勝敗</label>
              <select
                name="result"
                value={form.result}
                onChange={handleChange}
                className={`border p-2 rounded w-full ${errors.result ? "border-red-500" : ""}`}
                aria-invalid={!!errors.result}
              >
                <option value="">選択</option>
                <option value="勝利">勝利</option>
                <option value="敗北">敗北</option>
                <option value="引き分け">引き分け</option>
                <option value="-">-</option>
              </select>
              {errors.result && <p className="text-left text-red-500 text-sm mt-1">{errors.result}</p>}
            </div>

            {/* 投球回数 */}
            <div className="flex flex-col">
              <label className="mb-1 font-medium">投球回数</label>
              <InningsSelect
                value={form.pitching_innings_outs}
                onChange={handleChange}
                error={errors.pitching_innings_outs}
              />
            </div>
          </div>

          {/* 数値フィールド */}
          <div className="flex justify-center">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 w-full">
              {numberFields.map(f => (
                <NumberInput
                  key={f.key}
                  label={f.label}
                  name={f.key}
                  value={form[f.key]}
                  onChange={handleChange}
                  unit={f.unit}
                  error={errors[f.key]}
                />
              ))}
            </div>
          </div>

          {/* ボタン */}
          <div className="flex justify-center gap-4 mt-6">
            {!isEdit && !onlyOnePlayerLeft && (
              <button
                type="button"
                onClick={e => handleSubmit(e, "continue")}
                className="w-40 bg-blue-500 hover:bg-blue-600 text-white py-2 rounded shadow"
              >
                続けて登録
              </button>
            )}
            <button
              type="button"
              onClick={e => handleSubmit(e, "summary")}
              className="w-40 bg-blue-500 hover:bg-blue-600 text-white py-2 rounded shadow"
            >
              {isEdit ? "更新する" : "結果まとめへ"}
            </button>
          </div>
        </form>
      </div>

      {/* 登録済み選手 */}
      {!isEdit && (
        <div className="mt-10 text-left">
          <h2 className="text-xl font-semibold mb-2">登録済み選手一覧</h2>
          {registeredPitchers.length === 0 ? (
            <p>まだ登録されていません</p>
          ) : (
            <ul className="list-disc list-inside space-y-1">
              {registeredPitchers.map(id => {
                const user = users.find(u => u.id === id);
                return user ? <li key={id}>{user.name}</li> : null;
              })}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
