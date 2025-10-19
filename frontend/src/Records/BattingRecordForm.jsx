import { useEffect, useState, useMemo } from "react";
import axios from "axios";
import { useLocation, useNavigate, useParams } from "react-router-dom";

// 子コンポーネント: NumberInput 数値入力フォームをまとめて共通化したもの
const NumberInput = ({ label, name, value, onChange, unit, note, error }) => (
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
    {note && <p className="text-left text-gray-500 text-xs">{note}</p>}
    {error && <p className="text-left text-red-500 text-sm mt-1">{error}</p>}
  </div>
);

export default function BattingRecordForm() {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();
  const isEdit = !!id;

  const [form, setForm] = useState({
    game_id: "",
    user_id: "",
    order_no: "",
    position: "",
    at_bats: "",
    hits: "",
    doubles: "",
    triples: "",
    home_runs: "",
    rbis: "",
    runs: "",
    walks: "",
    strikeouts: "",
    steals: "",
    caught_stealing: "",
    errors: "",
  });

  // 選手一覧・登録済み選手・バリデーションエラー
  const [users, setUsers] = useState([]);
  const [registeredBatters, setRegisteredBatters] = useState([]);
  const [errors, setErrors] = useState({});


  // 数値項目一覧（繰り返し部分をまとめる）
  const numberFields = [
    { key: "at_bats", label: "打数", unit: "打数", note: "※打数には四死球を含みません" },
    { key: "hits", label: "一塁打", unit: "本" },
    { key: "doubles", label: "二塁打", unit: "本" },
    { key: "triples", label: "三塁打", unit: "本" },
    { key: "home_runs", label: "本塁打", unit: "本" },
    { key: "rbis", label: "打点", unit: "点" },
    { key: "runs", label: "得点", unit: "点" },
    { key: "walks", label: "四死球", unit: "回" },
    { key: "strikeouts", label: "三振", unit: "回" },
    { key: "steals", label: "盗塁数", unit: "回" },
    { key: "caught_stealing", label: "盗塁成功", unit: "回" },
    { key: "errors", label: "失策", unit: "回" },
  ];

  // 選手一覧を取得（同チームの打者）
  const fetchUsers = async () => {
    try {
      const res = await axios.get("/api/users/batter");
      setUsers(res.data);
    } catch (err) {
      console.error("Failed to fetch users:", err);
      setUsers([]);
    }
  };

  // すでに打撃成績登録済みの選手IDを取得
  const fetchRegisteredUserIds = async (gameId = form.game_id) => {
    if (!gameId) return;
    try {
      const res = await axios.get(`/api/records/batting/registered-users?game_id=${gameId}`);
      setRegisteredBatters(res.data);
    } catch (err) {
      console.error("Failed to fetch registered batters:", err);
      setRegisteredBatters([]);
    }
  };

  useEffect(() => { fetchUsers(); }, []);

  // 新規登録時：試合IDを state から受け取る
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
    if (!isEdit || !id) return;
    axios.get(`/api/records/batting/${id}`)
      .then(res => { setForm(res.data); fetchRegisteredUserIds(res.data.game_id); })
      .catch(err => { console.error(err); alert("データの取得に失敗しました"); });
  }, [id, isEdit]);

  const handleChange = e => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const validateForm = () => {
    const newErrors = {};
    if (!form.user_id) newErrors.user_id = "選手を選択してください";
    if (!form.position) newErrors.position = "守備位置を選択してください";
    if (!form.order_no) newErrors.order_no = "打順を選択してください";
    numberFields.forEach(f => {
      if (form[f.key] === "" || isNaN(form[f.key])) newErrors[f.key] = "数字を入力してください";
    });
    return newErrors;
  };

  // 登録・更新API呼び出し
  const submitForm = async () => {
    try {
      if (isEdit) {
        await axios.put(`/api/records/batting/${id}`, form);
        navigate(`/games/${form.game_id}`);
      } else {
        await axios.post("/api/records/batting", form);
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
        else if (action === "pitching") navigate("/records/pitching", { state: { game_id: form.game_id } });
      }
    } catch {
      setErrors({ general: "通信エラーが発生しました" });
    }
  };


  // 登録済みの選手を除外して選択肢に出す
  const selectableUsers = useMemo(() => {
    return users.filter(u => isEdit ? u.id === form.user_id || !registeredBatters.includes(u.id) : !registeredBatters.includes(u.id));
  }, [users, registeredBatters, form.user_id, isEdit]);

  // 残り1人だけなら「続けて登録」ボタンを非表示にする
  const MINIMUM_SELECTABLE_USERS = 1;
  const onlyOnePlayerLeft = selectableUsers.length === MINIMUM_SELECTABLE_USERS;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <button onClick={() => navigate(-1)} className="text-gray-500 hover:text-gray-800 text-lg">← 戻る</button>
        {!isEdit && registeredBatters.length > 0 && (
          <button
            onClick={() => navigate("/records/pitching", { state: { game_id: form.game_id } })}
            className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded shadow"
          >
            次へ
          </button>
        )}
      </div>

      <h1 className="text-3xl font-bold text-gray-800 border-b-2 border-green-500 inline-block pb-1">
        打撃成績 {isEdit ? "編集" : "登録"}
      </h1>

      {/* Form */}
      <div className="bg-white rounded-xl shadow-lg p-8 space-y-6">
        <form className="space-y-6">
          {/* 選手・守備位置・打順 */}
          <div className="text-left grid grid-cols-1 xl:grid-cols-3 gap-2">
            {[
              { key: "user_id", label: "選手名", options: selectableUsers.map(u => ({ value: u.id, label: u.name })) },
              { key: "position", label: "守備位置", options: ["投手", "捕手", "一塁手", "二塁手", "三塁手", "遊撃手", "左翼手", "中堅手", "右翼手", "DH", "代打"].map(v => ({ value: v, label: v })) },
              { key: "order_no", label: "打順", options: Array.from({ length: 9 }, (_, i) => ({ value: i + 1, label: `${i + 1}番` })) },
            ].map(f => (
              <div key={f.key} className="flex flex-col">
                <label htmlFor={f.key} className="mb-1 font-medium">{f.label}</label>
                <select
                  id={f.key}
                  name={f.key}
                  value={form[f.key]}
                  onChange={handleChange}
                  className={`border p-2 rounded w-full ${errors[f.key] ? "border-red-500" : ""}`}
                  aria-invalid={!!errors[f.key]}
                >
                  <option value="">選択してください</option>
                  {f.options.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                </select>
                {errors[f.key] && <p className="text-left text-red-500 text-sm mt-1">{errors[f.key]}</p>}
              </div>
            ))}
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
                  note={f.note}
                  error={errors[f.key]}
                />
              ))}
            </div>
          </div>

          {/* Buttons */}
          <div className="flex justify-center gap-4 mt-6">
            {!isEdit && !onlyOnePlayerLeft && (
              <button type="button" onClick={e => handleSubmit(e, "continue")} className="w-40 bg-blue-500 hover:bg-blue-600 text-white py-2 rounded shadow">続けて登録</button>
            )}
            <button type="button" onClick={e => handleSubmit(e, "pitching")} className="w-40 bg-blue-500 hover:bg-blue-600 text-white py-2 rounded shadow">
              {isEdit ? "更新する" : "投手登録へ"}
            </button>
          </div>

        </form>
      </div>

      {/* 登録済み選手 */}
      {!isEdit && (
        <div className="mt-10 text-left">
          <h2 className="text-xl font-semibold mb-2">登録済み選手一覧</h2>
          {registeredBatters.length === 0 ? (
            <p>まだ登録されていません</p>
          ) : (
            <ul className="list-disc list-inside space-y-1">
              {registeredBatters.map(id => {
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
