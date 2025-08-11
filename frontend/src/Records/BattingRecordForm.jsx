import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function GameRecordForm() {
  const navigate = useNavigate();
  const [errors, setErrors] = useState({});

  const handleBack = () => {
    navigate(-1);
  };

  const [form, setForm] = useState({
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

  useEffect(() => {
    axios.get('/api/users')
      .then(res => {
        setUsers(res.data);
      })
      .catch(() => {
        setUsers([]);
      });
  }, []);

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
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

      await axios.post('/api/records/batting', form);
      navigate('/records/pitching');

    } catch (err) {

      if (err.response && err.response.status === 422) {
        setErrors(err.response.data.errors || { general: '入力に誤りがあります' });
      } else {
        setErrors({ general: '通信エラーが発生しました' });
      }
    }
  };

  return (
    <div className="px-10 pt-10 pb-20">
      <button className="block text-left text-xl" onClick={handleBack}>戻る</button>
      <h1 className="text-2xl mt-10">打撃結果</h1>
      <form onSubmit={handleSubmit}>

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
            {users.map(user => (
              <option key={user.id} value={user.id}>{user.id}</option>
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
                placeholder=""
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
                placeholder=""
                className="border p-2 w-12 text-center" />
            </div>

            <div>
              <p>打数</p>
            </div>

          </div>
        </div>
        {errors.at_bats && <p className="text-red-600 mt-1 text-right">{errors.at_bats}</p>}

        <div className="text-right md:mt-10">
          <button type="submit" className="mt-5 mx-auto w-40 bg-blue-500 hover:bg-blue-600 text-white py-2 rounded transition">
            打撃登録へ
          </button>
        </div>

      </form>
    </div>
  );

}
