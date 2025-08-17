import { useEffect, useState } from "react";
import axios from "axios";
import { useLocation, useNavigate, useParams } from "react-router-dom";

export default function BattingRecordForm() {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();
  const [errors, setErrors] = useState({});
  const [registeredBatters, setRegisteredBatters] = useState([]);
  const isEdit = id;

  const handleBack = () => {
    navigate(-1);
  };

  const [form, setForm] = useState({
    game_id: '',
    user_id: '',
    order_no: '',
    position: '',
    at_bats: '',
    hits: '',
    rbis: '',
    runs: '',
    walks: '',
    strikeouts: '',
    steals: '',
    caught_stealing: '',
    errors: '',
  });

  const [users, setUsers] = useState([]);

  const fetchRegisteredUserIds = (gameId = form.game_id) => {
    if (!gameId) return;
    axios.get(`/api/records/batting/registered-users?game_id=${gameId}`)
      .then(res => setRegisteredBatters(res.data))
      .catch(() => setRegisteredBatters([]));
  };


  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  // ユーザー一覧取得
  useEffect(() => {
    axios.get('/api/users') // 適切なAPIに置き換えてください
      .then(res => setUsers(res.data))
      .catch(() => setUsers([]));
  }, []);

  // game_id の初期セットと新規登録用登録済み選手取得
  useEffect(() => {
    // 新規登録時のみ location.state から game_id を取得
    const gameIdFromState = location.state?.game_id;

    if (!isEdit && !gameIdFromState) {
      // 新規登録で game_id がない場合のみゲーム一覧へ
      navigate('/records/game');
      return;
    }

    // 編集モードの場合は game_id は編集データ取得時にセットされる
    if (gameIdFromState) {
      setForm(prev => ({ ...prev, game_id: gameIdFromState }));
      fetchRegisteredUserIds(gameIdFromState);
    }
  }, [location.state, navigate, isEdit]);



  // 編集モードの既存データ取得
  useEffect(() => {
    if (!isEdit || !id) return;

    axios.get(`/api/records/batting/${id}`)
      .then(res => {
        setForm({
          game_id: res.data.game_id,
          user_id: res.data.user_id,
          position: res.data.position,
          order_no: res.data.order_no,
          at_bats: res.data.at_bats,
          hits: res.data.hits,
          rbis: res.data.rbis,
          runs: res.data.runs,
          walks: res.data.walks,
          strikeouts: res.data.strikeouts,
          steals: res.data.steals,
          caught_stealing: res.data.caught_stealing,
          errors: res.data.errors,
        });
        fetchRegisteredUserIds(res.data.game_id);
      })
      .catch(() => alert('データの取得に失敗しました'));
  }, [id, isEdit]);



  const handleSubmit = async (e, action) => {
    e.preventDefault();

    const newErrors = {};

    if (!form.user_id) newErrors.user_id = '選手を選択してください';

    if (!form.position) newErrors.position = '守備位置を選択してください';

    if (!form.order_no) newErrors.order_no = '打順を選択してください';

    const numFields = ['at_bats', 'hits', 'rbis', 'runs', 'walks', 'strikeouts', 'steals', 'caught_stealing', 'errors'];

    numFields.forEach(field => {
      if (form[field] === '') {
        newErrors[field] = '数字を入力してください';
      } else if (isNaN(form[field])) {
        newErrors[field] = '数字を入力してください'
      }
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    setErrors({});

    try {
      if (isEdit) {
        await axios.put(`/api/records/batting/${id}`, form);
        // 編集後は詳細ページに戻す
        navigate(`/games/${form.game_id}`);
      } else {
        const res = await axios.post('/api/records/batting', form);
        const newId = res.data.id;
        if (action === 'continue') {
          setForm({
            ...form,
            user_id: '',
            order_no: '',
            position: '',
            at_bats: '',
            hits: '',
            rbis: '',
            runs: '',
            walks: '',
            strikeouts: '',
            steals: '',
            caught_stealing: '',
            errors: '',
          });
          fetchRegisteredUserIds();
        } else if (action === 'pitching') {
          navigate('/records/pitching', { state: { game_id: form.game_id } });
        }
      }
    } catch (err) {
      console.log(err);
    }
  };

  const selectableUsers = users.filter(user => {
    // 編集モードなら現在の選手を必ず表示
    if (isEdit && user.id === form.user_id) return true;
    return !registeredBatters.includes(user.id);
  });


  const allPlayersRegistered = selectableUsers.length === 1;

  return (
    <div className="px-10 pt-10 pb-20">
      <div className="flex justify-between">
        <button className="block text-left text-xl" onClick={handleBack}>戻る</button>
        {/* 編集モードでなければ次へ表示 */}
        {!isEdit && registeredBatters.length > 0 && (
          <div className="mb-5 text-right">
            <button
              type="button"
              onClick={() => navigate('/records/pitching', { state: { game_id: game.id } })}
              className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded"
            >
              次へ
            </button>
          </div>
        )}
      </div>
      <h1 className="text-2xl mt-10">打撃成績</h1>
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
            ))};
          </select>
        </div>
        {errors.user_id && <p className="text-red-600 mt-1 text-right">{errors.user_id}</p>}

        {/* 守備位置 */}
        <div className="flex mt-10 justify-between items-center">
          <label htmlFor="position">守備位置</label>
          <select
            id="position"
            name="position"
            type="text"
            value={form.position}
            onChange={handleChange}
            className="border p-2 md:w-80"
          >
            <option value="">守備位置を選択してください</option>
            <option value="投手">投手</option>
            <option value="捕手">捕手</option>
            <option value="一塁手">一塁手</option>
            <option value="二塁手">二塁手</option>
            <option value="三塁手">三塁手</option>
            <option value="遊撃手">遊撃手</option>
            <option value="左翼手">左翼手</option>
            <option value="中堅手">中堅手</option>
            <option value="右翼手">右翼手</option>
            <option value="DH">DH</option>
            <option value="代打">代打</option>
          </select>
        </div>
        {errors.position && <p className="text-red-600 mt-1 text-right">{errors.position}</p>}

        {/* 打順 */}
        <div className="flex mt-10 justify-between items-center">
          <label htmlFor="order_no">打順</label>
          <select
            id="order_no"
            name="order_no"
            value={form.order_no}
            onChange={handleChange}
            className="border p-2 md:w-20"
          >
            <option value="">打順</option>
            <option value="1">1番</option>
            <option value="2">2番</option>
            <option value="3">3番</option>
            <option value="4">4番</option>
            <option value="5">5番</option>
            <option value="6">6番</option>
            <option value="7">7番</option>
            <option value="8">8番</option>
            <option value="9">9番</option>
          </select>
        </div>
        {errors.order_no && <p className="text-red-600 mt-1 text-right">{errors.order_no}</p>}

        {/* 打席数 */}
        <div className="flex mt-10 justify-between items-center">
          <label htmlFor="at_bats">打席数</label>
          <div className=" items-center flex gap-3">

            <div className="items-center">
              <input
                id="at_bats"
                name="at_bats"
                min={0}
                type="number"
                value={form.at_bats}
                onChange={handleChange}
                className="border p-2 w-12 text-center" />
            </div>

            <div>
              <p>打数</p>
            </div>

          </div>
        </div>
        {errors.at_bats && <p className="text-red-600 mt-1 text-right">{errors.at_bats}</p>}

        {/* 打席数 */}
        <div className="flex mt-10 justify-between items-center">
          <label htmlFor="hits">安打数</label>
          <div className=" items-center flex gap-3">

            <div className="items-center">
              <input
                id="hits"
                name="hits"
                min={0}
                type="number"
                value={form.hits}
                onChange={handleChange}
                className="border p-2 w-12 text-center" />
            </div>

            <div>
              <p>安打</p>
            </div>

          </div>
        </div>
        {errors.hits && <p className="text-red-600 mt-1 text-right">{errors.hits}</p>}

        {/* 打点 */}
        <div className="flex mt-10 justify-between items-center">
          <label htmlFor="rbis">打点</label>
          <div className=" items-center flex gap-3">

            <div className="items-center">
              <input
                id="rbis"
                name="rbis"
                min={0}
                type="number"
                value={form.rbis}
                onChange={handleChange}
                className="border p-2 w-12 text-center" />
            </div>

            <div>
              <p>打点</p>
            </div>

          </div>
        </div>
        {errors.rbis && <p className="text-red-600 mt-1 text-right">{errors.rbis}</p>}

        {/* 得点 */}
        <div className="flex mt-10 justify-between items-center">
          <label htmlFor="runs">得点</label>
          <div className=" items-center flex gap-3">

            <div className="items-center">
              <input
                id="runs"
                name="runs"
                min={0}
                type="number"
                value={form.runs}
                onChange={handleChange}
                className="border p-2 w-12 text-center" />
            </div>

            <div>
              <p>得点</p>
            </div>

          </div>
        </div>
        {errors.runs && <p className="text-red-600 mt-1 text-right">{errors.runs}</p>}

        {/* 四死球 */}
        <div className="flex mt-10 justify-between items-center">
          <label htmlFor="walks">四死球</label>
          <div className=" items-center flex gap-3">

            <div className="items-center">
              <input
                id="walks"
                name="walks"
                min={0}
                type="number"
                value={form.walks}
                onChange={handleChange}
                className="border p-2 w-12 text-center" />
            </div>

            <div>
              <p>四死球</p>
            </div>

          </div>
        </div>
        {errors.walks && <p className="text-red-600 mt-1 text-right">{errors.walks}</p>}

        {/* 三振 */}
        <div className="flex mt-10 justify-between items-center">
          <label htmlFor="strikeouts">三振</label>
          <div className=" items-center flex gap-3">

            <div className="items-center">
              <input
                id="strikeouts"
                name="strikeouts"
                min={0}
                type="number"
                value={form.strikeouts}
                onChange={handleChange}
                className="border p-2 w-12 text-center" />
            </div>

            <div>
              <p>三振</p>
            </div>

          </div>
        </div>
        {errors.strikeouts && <p className="text-red-600 mt-1 text-right">{errors.strikeouts}</p>}

        {/* 盗塁 */}
        <div className="flex mt-10 justify-between items-center">
          <label htmlFor="steals">盗塁</label>
          <div className=" items-center flex gap-3">

            <div className="items-center">
              <input
                id="steals"
                name="steals"
                min={0}
                type="number"
                value={form.steals}
                onChange={handleChange}
                className="border p-2 w-12 text-center" />
            </div>

            <div>
              <p>盗塁</p>
            </div>

          </div>
        </div>
        {errors.steals && <p className="text-red-600 mt-1 text-right">{errors.steals}</p>}

        {/* 盗塁死 */}
        <div className="flex mt-10 justify-between items-center">
          <label htmlFor="caught_stealing">盗塁死</label>
          <div className=" items-center flex gap-3">

            <div className="items-center">
              <input
                id="caught_stealing"
                name="caught_stealing"
                min={0}
                type="number"
                value={form.caught_stealing}
                onChange={handleChange}
                className="border p-2 w-12 text-center" />
            </div>

            <div>
              <p>盗塁死</p>
            </div>

          </div>
        </div>
        {errors.caught_stealing && <p className="text-red-600 mt-1 text-right">{errors.caught_stealing}</p>}

        {/* 失策 */}
        <div className="flex mt-10 justify-between items-center">
          <label htmlFor="errors">失策</label>
          <div className=" items-center flex gap-3">

            <div className="items-center">
              <input
                id="errors"
                name="errors"
                min={0}
                type="number"
                value={form.errors}
                onChange={handleChange}
                className="border p-2 w-12 text-center" />
            </div>

            <div>
              <p>失策</p>
            </div>

          </div>
        </div>
        {errors.errors && <p className="text-red-600 mt-1 text-right">{errors.errors}</p>}

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
            onClick={(e) => handleSubmit(e, 'pitching')}
            className="mt-5 w-40 bg-blue-500 hover:bg-blue-600 text-white py-2 rounded transition">
            {isEdit ? '更新する' : '投手登録へ'}
          </button>
        </div>
      </form>

      {!isEdit && (
        <div className="mt-10 text-left">
          <h2 className="text-xl font-semibold">登録済み選手一覧</h2>
          {registeredBatters.length === 0 ? (
            <p className="mt-3">まだ登録されていません</p>
          ) : (
            <ul className="mt-3 list-disc list-inside text-lg">
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
