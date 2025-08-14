import { useEffect, useState } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";

export default function PitchingRecordForm() {
  const navigate = useNavigate();
  const location = useLocation();
  const [errors, setErrors] = useState({});
  const [registeredPitchers, setRegisteredPitchers] = useState([]);

  const handleBack = () => {
    navigate(-1);
  };

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

  const [users, setUsers] = useState([]);

  const fetchRegisteredUserIds = () => {
    if (!form.game_id) return;
    axios.get(`/api/records/pitching/registered-users?game_id=${form.game_id}`)
      .then(res => setRegisteredPitchers(res.data))
      .catch(() => setRegisteredPitchers([]));
  };

  useEffect(() => {
    if (location.state && location.state.game_id) {
      setForm(prev => ({ ...prev, game_id: location.state.game_id }));
    }
  }, [location.state]);

  useEffect(() => {
    if (!location.state || !location.state.game_id) {
      navigate('/records/game');
      setForm(prev => ({ ...prev, game_id: location.state.game_id }));
    }
  }, [location.state, navigate]);

  useEffect(() => {
    axios.get('/api/users')
      .then(res => {
        setUsers(res.data);
      })
      .catch(() => {
        setUsers([]);
      });
  }, []);

  useEffect(() => {
    fetchRegisteredUserIds();
  }, [form.game_id]);

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e, action) => {
    e.preventDefault();

    const newErrors = {};

    if (!form.user_id) newErrors.user_id = '選手を選択してください';
    if (!form.result) newErrors.result = '勝敗を選択してください';
    if (!form.pitching_innings_outs) newErrors.pitching_innings_outs = '投球回数を選択してください';
    if (!form.pitches) newErrors.pitches = '投球数を入力してください';
    if (!form.strikeouts) newErrors.strikeouts = '奪三振数を入力してください';
    if (!form.hits_allowed) newErrors.hits_allowed = '被安打数を入力してください';
    if (!form.hr_allowed) newErrors.hr_allowed = '被本塁打数を入力してください';
    if (!form.walks_given) newErrors.walks_given = '四死球数を入力してください';
    if (!form.runs_allowed) newErrors.runs_allowed = '失点数を入力してください';
    if (!form.earned_runs) newErrors.earned_runs = '自責点を入力してください';

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

      await axios.post('/api/records/pitching', form);

      fetchRegisteredUserIds();

      if (action === 'continue') {
        // フォームだけクリアして同ページに留まる
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
        // 結果まとめページへ遷移
        navigate('/records/summary', { state: { game_id: form.game_id } });

      }

    } catch (err) {

      if (err.response && err.response.status === 422) {
        setErrors(err.response.data.errors || { general: '入力に誤りがあります' });
      } else {
        setErrors({ general: '通信エラーが発生しました' });
      }
    }
  };

  const selectableUsers = users.filter(user => !registeredPitchers.includes(user.id));
  const allPlayersRegistered = selectableUsers.length === 1;

  return (
    <div className="px-10 pt-10 pb-20">
      <div className="flex justify-between">
        <button className="block text-left text-xl" onClick={handleBack}>戻る</button>
        {registeredPitchers.length > 0 && (
          <div className="mb-5 text-right">
            <button
              type="button"
              onClick={() => navigate(`/records/summary`, { state: { game_id: form.game_id } })}
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
            <option value="1">1回</option>
            <option value="2">2回</option>
            <option value="3">3回</option>
            <option value="4">4回</option>
            <option value="5">5回</option>
            <option value="6">6回</option>
            <option value="7">7回</option>
            <option value="8">8回</option>
            <option value="9">9回</option>

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
          {!allPlayersRegistered && (
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
            結果まとめへ
          </button>
        </div>

      </form>

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

    </div>
  );

}
