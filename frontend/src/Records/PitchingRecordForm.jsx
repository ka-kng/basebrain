import { useEffect, useState } from "react";
import axios from "axios";
import { useLocation, useNavigate, useParams } from "react-router-dom";

export default function PitchingRecordForm() {
  const navigate = useNavigate();
  const location = useLocation();
  const [errors, setErrors] = useState({});
  const { id } = useParams();
  const [registeredPitchers, setRegisteredPitchers] = useState([]);
  const [users, setUsers] = useState([]);

  const isEdit = id;

  const [form, setForm] = useState({
    game_id: '',
    user_id: '',
    result: '',
    pitching_innings_outs: '',
    pitches: '',
    strikeouts: '',
    hits_allowed: '',
    hr_allowed: '',
    walks_given: '',
    runs_allowed: '',
    earned_runs: '',
  });

  const handleBack = () => {
    navigate(-1);
  };

  const fetchRegisteredUserIds = () => {
    if (!form.game_id) return;
    axios.get(`/api/records/pitching/registered-users?game_id=${form.game_id}`)
      .then(res => setRegisteredPitchers(res.data))
      .catch(() => setRegisteredPitchers([]));
  };

  useEffect(() => {
    axios.get("/api/users")
      .then(res => setUsers(res.data))
      .catch(() => setUsers([]));
  }, []);

  useEffect(() => {
    const gameIdFromState = location.state?.game_id;
    if (!isEdit && !gameIdFromState) {
      navigate("/records/game");
      return;
    }
    if (gameIdFromState) {
      setForm(prev => ({ ...prev, game_id: gameIdFromState }));
      fetchRegisteredUserIds(gameIdFromState);
    }
  }, [location.state, navigate, isEdit]);

  useEffect(() => {
    if (!isEdit || !id) return;
    axios.get(`/api/records/pitching/${id}`)
      .then(res => {
        setForm({
          game_id: res.data.game_id,
          user_id: res.data.user_id,
          result: res.data.result,
          pitching_innings_outs: res.data.pitching_innings_outs,
          pitches: res.data.pitches,
          strikeouts: res.data.strikeouts,
          hits_allowed: res.data.hits_allowed,
          hr_allowed: res.data.hr_allowed,
          walks_given: res.data.walks_given,
          runs_allowed: res.data.runs_allowed,
          earned_runs: res.data.earned_runs,
        });
        fetchRegisteredUserIds(res.data.game_id);
      })
      .catch(() => alert("データの取得に失敗しました"));
  }, [id, isEdit]);

  useEffect(() => {
    fetchRegisteredUserIds();
  }, [form.game_id]);

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e, action) => {
    e.preventDefault();

    const newErrors = {};

    if (form.user_id === '') newErrors.user_id = '選手を選択してください';
    if (form.result === '') newErrors.result = '勝敗を選択してください';
    if (form.pitching_innings_outs === '') newErrors.pitching_innings_outs = '投球回数を選択してください';
    if (form.pitches === '') newErrors.pitches = '投球数を入力してください';
    if (form.strikeouts === '') newErrors.strikeouts = '奪三振数を入力してください';
    if (form.hits_allowed === '') newErrors.hits_allowed = '被安打数を入力してください';
    if (form.hr_allowed === '') newErrors.hr_allowed = '被本塁打数を入力してください';
    if (form.walks_given === '') newErrors.walks_given = '四死球数を入力してください';
    if (form.runs_allowed === '') newErrors.runs_allowed = '失点数を入力してください';
    if (form.earned_runs === '') newErrors.earned_runs = '自責点を入力してください';

    const numFields = ['pitches', 'strikeouts', 'hits_allowed', 'hr_allowed', 'walks_given', 'runs_allowed', 'earned_runs'];

    numFields.forEach(field => {
      if (isNaN(form[field])) {
        newErrors[field] = '数字を入力してください';
      }
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    setErrors({});

    try {

      if (isEdit) {
        // 編集モードの場合はPUTで更新
        await axios.put(`/api/records/pitching/${id}`, form);
        // 詳細ページに戻る
        navigate(`/games/${form.game_id}`);
      } else {
        // 新規登録
        await axios.post('/api/records/pitching', form);
        fetchRegisteredUserIds();

        if (action === 'continue') {
          setForm(prev => ({
            ...prev,
            user_id: '',
            result: '',
            pitching_innings_outs: '',
            pitches: '',
            strikeouts: '',
            hits_allowed: '',
            hr_allowed: '',
            walks_given: '',
            runs_allowed: '',
            earned_runs: '',
          }));
        } else if (action === 'summary') {
          navigate('/records/summary', { state: { game_id: form.game_id } });
        }
      }

    } catch (err) {
      if (err.response && err.response.status === 422) {
        setErrors(err.response.data.errors || { general: '入力に誤りがあります' });
      } else {
        setErrors({ general: '通信エラーが発生しました' });
      }
    }
  };

  const selectableUsers = users.filter(user => {
    // 編集モードなら現在の選手を必ず表示
    if (isEdit && user.id === form.user_id) return true;
    return !registeredPitchers.includes(user.id);
  });

  const allPlayersRegistered = selectableUsers.length === 1;

  return (
    <div className="px-10 pt-10 pb-20">
      <div className="flex justify-between">
        <button className="block text-left text-xl" onClick={handleBack}>戻る</button>
        {/* 編集モードでなければ次へ表示 */}
        {!isEdit && registeredPitchers.length > 0 && (
          <div className="mb-5 text-right">
            <button
              type="button"
              onClick={() => navigate('/records/summary', { state: { game_id: game.id } })}
              className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded"
            >
              次へ
            </button>
          </div>
        )}
      </div>
      <h1 className="text-2xl mt-10">投手結果</h1>
      <form>

        {/* 選手名 */}
        <div className="flex mt-10 justify-between items-center">
          <label htmlFor="user_id">選手名</label>
          <select
            id="user_id"
            name="user_id"
            type="text"
            value={form.user_id}
            onChange={handleChange}
            className="border p-2 md:w-80"
          >
            <option value="">選手を選択してください</option>
            {selectableUsers.map(user => (
              <option key={user.id} value={user.id}>{user.name}</option>
            ))}
          </select>
        </div>
        {errors.user_id && <p className="text-red-600 mt-1 text-right">{errors.user_id}</p>}

        {/* 打席数 */}
        <div className="flex mt-10 justify-between items-center">
          <label htmlFor="result">勝敗</label>
          <select
            id="result"
            name="result"
            type="text"
            value={form.result}
            onChange={handleChange}
            className="border p-2 w-24"
          >
            <option value="">選択</option>
            <option value="勝利">勝利</option>
            <option value="敗北">敗北</option>

          </select>
        </div>
        {errors.result && <p className="text-red-600 mt-1 text-right">{errors.result}</p>}

        {/* 投球回数 */}
        <div className="flex mt-10 justify-between items-center">
          <label htmlFor="pitching_innings_outs">投球回数</label>

          <select
            id="pitching_innings_outs"
            name="pitching_innings_outs"
            type="text"
            value={form.pitching_innings_outs}
            onChange={handleChange}
            className="border p-2 w-24"
          >
            <option value="">選択</option>
            <option value="1">0回 1/3</option>
            <option value="2">0回 2/3</option>
            <option value="3">1回</option>
            <option value="4">1回 1/3</option>
            <option value="5">1回 2/3</option>
            <option value="6">2回</option>
            <option value="7">2回 1/3</option>
            <option value="8">2回 2/3</option>
            <option value="9">3回</option>
            <option value="10">3回 1/3</option>
            <option value="11">3回 2/3</option>
            <option value="12">4回</option>
            <option value="13">4回 1/3</option>
            <option value="14">4回 2/3</option>
            <option value="15">5回</option>
            <option value="16">5回 1/3</option>
            <option value="17">5回 2/3</option>
            <option value="18">6回</option>
            <option value="19">6回 1/3</option>
            <option value="20">6回 2/3</option>
            <option value="21">7回</option>
            <option value="22">7回 1/3</option>
            <option value="23">7回 2/3</option>
            <option value="24">8回</option>
            <option value="25">8回 1/3</option>
            <option value="26">8回 2/3</option>
            <option value="27">9回</option>
            <option value="28">9回 1/3</option>
            <option value="29">9回 2/3</option>
            <option value="30">10回</option>
            <option value="31">10回 1/3</option>
            <option value="32">10回 2/3</option>
            <option value="33">11回</option>
            <option value="34">11回 1/3</option>
            <option value="35">11回 2/3</option>
            <option value="36">12回</option>

          </select>

        </div>
        {errors.pitching_innings_outs && <p className="text-red-600 mt-1 text-right">{errors.pitching_innings_outs}</p>}

        {/* 投球数 */}
        <div className="flex mt-10 justify-between items-center">
          <label htmlFor="pitches">投球数</label>
          <div className=" items-center flex gap-3">

            <div className="items-center">
              <input
                id="pitches"
                name="pitches"
                min={0}
                type="number"
                value={form.pitches}
                onChange={handleChange}
                className="border p-2 w-16 text-center" />
            </div>

            <div>
              <p>球</p>
            </div>

          </div>
        </div>
        {errors.pitches && <p className="text-red-600 mt-1 text-right">{errors.pitches}</p>}

        {/* 奪三振 */}
        <div className="flex mt-10 justify-between items-center">
          <label htmlFor="strikeouts">奪三振</label>
          <div className=" items-center flex gap-3">

            <div className="items-center">
              <input
                id="strikeouts"
                name="strikeouts"
                min={0}
                type="number"
                value={form.strikeouts}
                onChange={handleChange}
                className="border p-2 w-16 text-center" />
            </div>

            <div>
              <p>奪三振</p>
            </div>

          </div>
        </div>
        {errors.strikeouts && <p className="text-red-600 mt-1 text-right">{errors.strikeouts}</p>}

        {/* 被安打 */}
        <div className="flex mt-10 justify-between items-center">
          <label htmlFor="hits_allowed">被安打</label>
          <div className=" items-center flex gap-3">

            <div className="items-center">
              <input
                id="hits_allowed"
                name="hits_allowed"
                min={0}
                type="number"
                value={form.hits_allowed}
                onChange={handleChange}
                className="border p-2 w-16 text-center" />
            </div>

            <div>
              <p>本</p>
            </div>

          </div>
        </div>
        {errors.hits_allowed && <p className="text-red-600 mt-1 text-right">{errors.hits_allowed}</p>}

        {/* 被本塁打 */}
        <div className="flex mt-10 justify-between items-center">
          <label htmlFor="hr_allowed">被本塁打</label>
          <div className=" items-center flex gap-3">

            <div className="items-center">
              <input
                id="hr_allowed"
                name="hr_allowed"
                min={0}
                type="number"
                value={form.hr_allowed}
                onChange={handleChange}
                className="border p-2 w-16 text-center" />
            </div>

            <div>
              <p>本</p>
            </div>

          </div>
        </div>
        {errors.hr_allowed && <p className="text-red-600 mt-1 text-right">{errors.hr_allowed}</p>}

        {/* 四死球 */}
        <div className="flex mt-10 justify-between items-center">
          <label htmlFor="walks_given">四死球</label>
          <div className=" items-center flex gap-3">

            <div className="items-center">
              <input
                id="walks_given"
                name="walks_given"
                min={0}
                type="number"
                value={form.walks_given}
                onChange={handleChange}
                className="border p-2 w-16 text-center" />
            </div>

            <div>
              <p>四死球</p>
            </div>

          </div>
        </div>
        {errors.walks_given && <p className="text-red-600 mt-1 text-right">{errors.walks_given}</p>}

        {/* 失点 */}
        <div className="flex mt-10 justify-between items-center">
          <label htmlFor="runs_allowed">失点</label>
          <div className=" items-center flex gap-3">

            <div className="items-center">
              <input
                id="runs_allowed"
                name="runs_allowed"
                min={0}
                type="number"
                value={form.runs_allowed}
                onChange={handleChange}
                className="border p-2 w-16 text-center" />
            </div>

            <div>
              <p>失点</p>
            </div>

          </div>
        </div>
        {errors.runs_allowed && <p className="text-red-600 mt-1 text-right">{errors.runs_allowed}</p>}

        {/* 自責点 */}
        <div className="flex mt-10 justify-between items-center">
          <label htmlFor="earned_runs">自責点</label>
          <div className=" items-center flex gap-3">

            <div className="items-center">
              <input
                id="earned_runs"
                name="earned_runs"
                min={0}
                type="number"
                value={form.earned_runs}
                onChange={handleChange}
                className="border p-2 w-16 text-center" />
            </div>

            <div>
              <p>点</p>
            </div>

          </div>
        </div>
        {errors.earned_runs && <p className="text-red-600 mt-1 text-right">{errors.earned_runs}</p>}

        <div className="flex justify-end md:mt-10 mt-5 flex gap-5">
          {!isEdit && !allPlayersRegistered && (
            <button
              type="button"
              onClick={(e) => handleSubmit(e, 'continue')}
              className="mt-5 w-40 bg-blue-500 hover:bg-blue-600 text-white py-2 rounded transition"
            >
              続けて登録
            </button>
          )}
          <button
            type="button"
            onClick={(e) => handleSubmit(e, 'summary')}
            className="mt-5 w-40 bg-blue-500 hover:bg-blue-600 text-white py-2 rounded transition">
            {isEdit ? '更新する' : '結果まとめへ'}
          </button>
        </div>

      </form>


      {!isEdit && (
        <div className="mt-10 text-left">
          <h2 className="text-xl font-semibold">登録済み選手一覧</h2>
          {registeredPitchers.length === 0 ? (
            <p className="mt-3">まだ登録されていません</p>
          ) : (
            <ul className="mt-3 list-disc list-inside text-lg">
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
