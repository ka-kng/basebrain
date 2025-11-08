import { useEffect, useState, useMemo } from "react";
import axios from "axios";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import NumberInput from "../../features/Record/NumberInput";
import { BatterNumberFields } from "../../lib/numberFields";

export default function BattingRecordForm() {
  const navigate = useNavigate(); // ページ遷移用
  const location = useLocation(); // 前のページから渡されたstateを取得
  const { id } = useParams();  // URLパラメータからidを取得
  const isEdit = !!id; // idが存在する＝編集モード

  // フォームの状態を管理するstate
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

  // 選手一覧・登録済み選手・バリデーションエラーを管理
  const [users, setUsers] = useState([]); // チーム内の打者一覧
  const [registeredBatters, setRegisteredBatters] = useState([]); // すでに成績登録された選手のIDリスト
  const [errors, setErrors] = useState({}); // 入力エラー情報

  // チーム内の打者一覧を取得（初回のみ）
  const fetchUsers = async () => {
    try {
      const res = await axios.get("/api/users/batter");
      setUsers(res.data);  // 成功時、選手データをstateに格納
    } catch (err) {
      console.error("Failed to fetch users:", err);
      setUsers([]); // エラー時は空配列
    }
  };

  // すでに登録済みの選手IDを取得（同じ試合内で重複登録を防ぐ）
  const fetchRegisteredUserIds = async (gameId = form.game_id) => {
    if (!gameId) return; // 試合IDがない場合は処理しない
    try {
      const res = await axios.get(`/api/records/batting/registered-users?game_id=${gameId}`);
      setRegisteredBatters(res.data); // 登録済み選手のID配列を格納

    } catch (err) {
      console.error("Failed to fetch registered batters:", err);
      setRegisteredBatters([]);
    }
  };

  useEffect(() => { fetchUsers(); }, []); // 初回レンダー時に選手一覧を取得

  // 新規登録モード時に前ページから渡された game_id を受け取り処理
  useEffect(() => {
    const gameIdFromState = location.state?.game_id; // location.state から game_id を取り出す
    if (!isEdit && !gameIdFromState) return navigate("/records/game"); // 新規モードで game_id が無ければ試合一覧に戻す
    if (gameIdFromState) { // game_id が渡されていればフォームにセットして登録済みリストを取得
      setForm(prev => ({ ...prev, game_id: gameIdFromState })); // form に game_id をセット
      fetchRegisteredUserIds(gameIdFromState); // その試合の登録済み打者を再取得
    }
  }, [location.state, navigate, isEdit]);

  // 編集モード時は既存データを取得してフォームに反映する
  useEffect(() => {
    if (!isEdit || !id) return; // 編集モードでない、または id がなければ無視
    axios.get(`/api/records/batting/${id}`)
      .then(res => { setForm(res.data); fetchRegisteredUserIds(res.data.game_id); }) // 成功時にフォームに値をセットし登録済みを取得
      .catch(err => { console.error(err); alert("データの取得に失敗しました"); });
  }, [id, isEdit]);

  const handleChange = e => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const validateForm = () => { // フォームのバリデーション関数（問題があればエラーメッセージを返す）
    const newErrors = {};
    if (!form.user_id) newErrors.user_id = "選手を選択してください";
    if (!form.position) newErrors.position = "守備位置を選択してください";
    if (!form.order_no) newErrors.order_no = "打順を選択してください";
    BatterNumberFields.forEach(f => {
      if (form[f.key] === "" || isNaN(form[f.key])) newErrors[f.key] = "数字を入力してください";
    });
    return newErrors;
  };

  // 登録・更新API呼び出し
  const submitForm = async () => {
    try {
      if (isEdit) { // 編集モードなら PUT で更新
        await axios.put(`/api/records/batting/${id}`, form);
        navigate(`/games/${form.game_id}`); // 更新後は該当試合ページへ遷移
      } else { // 新規モードなら POST で登録
        await axios.post("/api/records/batting", form);
      }
    } catch (err) {
      console.error("Submit failed:", err);
      throw err;
    }
  };

  // 「続けて登録」用にフォームを初期化する関数
  const resetFormForContinue = () => {
    // game_id だけ残して他は空に
    setForm(prev => ({ ...Object.fromEntries(Object.keys(prev).map(k => [k, ""])), game_id: prev.game_id }));
    fetchRegisteredUserIds(); // 再度登録済みリストを取得して選択肢を更新
  };

  // 送信ボタン押下時のメイン処理
  const handleSubmit = async (e, action) => {
    e.preventDefault(); // フォームのデフォルト送信を防ぐ
    const validationErrors = validateForm(); // バリデーションを実行
    if (Object.keys(validationErrors).length) {
      setErrors(validationErrors); // エラーがあるなら state にセットして早期リターン
      return;
    }
    setErrors({}); // エラーなしなのでエラー表示をクリア
    try {
      await submitForm();
      if (!isEdit) { // 新規登録時のみアクション分岐
        if (action === "continue") resetFormForContinue(); // 続けて登録するならフォームリセット
        else if (action === "pitching") navigate("/records/pitching", { state: { game_id: form.game_id } }); // 投手登録画面へ遷移
      }
    } catch {
      setErrors({ general: "通信エラーが発生しました" });
    }
  };


  // 選択可能な選手リストを計算してメモ化（再計算を最小化）
  const selectableUsers = useMemo(() => {
    return users.filter(u => isEdit ? u.id === form.user_id || !registeredBatters.includes(u.id) : !registeredBatters.includes(u.id)); // 編集時は自分は選べる、既登録者は除外
  }, [users, registeredBatters, form.user_id, isEdit]); // 新規時は既登録者を除外

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
              {BatterNumberFields.map(f => (
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
