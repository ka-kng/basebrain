import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function GameRecordForm() {
  const navigate = useNavigate();
  const [errors, setErrors] = useState({});

  const handleBack = () => {
    navigate(-1);
  };

  const [form, setForm] = useState({
    date: '',
    game_type: '',
    tournament: '',
    opponent: '',
    team_score: '',
    opponent_score: '',
    memo: '',
  });

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = {};

    if (!form.date) newErrors.date = '試合日を入力してください';
    if (!form.game_type) newErrors.game_type = '試合種類を選択してください';
    if (!form.tournament) newErrors.tournament = '大会名を入力してください';
    if (!form.opponent) newErrors.opponent = '相手チーム名を入力してください';
    if (form.team_score === '' || isNaN(form.team_score)) newErrors.team_score = '自チームのスコアを正しく入力してください';
    if (form.opponent_score === '' || isNaN(form.opponent_score)) newErrors.opponent_score = '相手チームのスコアを正しく入力してください';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});

    try {

      await axios.post('/api/game', form);
      alert('登録成功');

    } catch (err) {

      console.log(err);

    }
  };

  return (
    <div className="px-10 pt-10 pb-20">
      <button className="block text-left text-xl" onClick={handleBack}>戻る</button>
      <h1 className="text-2xl mt-10">試合結果</h1>
      <form onSubmit={handleSubmit} className="">

        {/* 試合日 */}
        <div className="flex mt-10 justify-between items-center">
          <label htmlFor="date">試合日</label>
          <input
            id="date"
            type="date"
            name="date"
            value={form.date}
            onChange={handleChange}
            className="border p-2 md:px-10" />
        </div>
        {errors.date && <p className="text-red-600 mt-1 text-right">{errors.date}</p>}

        {/* 試合種類 */}
        <div className="flex mt-10 justify-between items-center">
          <label>試合種類</label>
          <div className=" items-center flex gap-3 md:gap-10 justify-between">

            <label className="items-center">
              <input
                type="radio"
                name="game_type"
                value="公式戦"
                checked={form.game_type === '公式戦'}
                onChange={handleChange}
                className="mr-1"
              />
              公式戦
            </label>

            <label className="items-center">
              <input
                type="radio"
                name="game_type"
                value="練習試合"
                checked={form.game_type === '練習試合'}
                onChange={handleChange}
                className="mr-1"
              />
              練習試合
            </label>
          </div>
        </div>
        {errors.game_type && <p className="text-red-600 mt-1 text-right">{errors.game_type}</p>}

        {/* 大会名 */}
        <div className="flex mt-10 justify-between items-center">
          <label htmlFor="tournament">大会名</label>
          <input
            id="tournament"
            type="text"
            name="tournament"
            value={form.tournament}
            onChange={handleChange}
            className="border p-2 md:px-10" />
        </div>
        {errors.tournament && <p className="text-red-600 mt-1 text-right">{errors.tournament}</p>}

        {/* 自チーム名 */}
        <div className="flex mt-10 justify-between items-center">
          <label htmlFor="">自チーム名</label>
          <input
            id=""
            type="text"
            name=""
            value={form.opponent}
            onChange={handleChange}
            className="border p-2 md:px-10" />
        </div>

        {/* 相手チーム名 */}
        <div className="flex mt-10 justify-between items-center">
          <label htmlFor="opponent">相手チーム名</label>
          <input
            id="opponent"
            type="text"
            name="opponent"
            value={form.opponent}
            onChange={handleChange}
            className="border p-2 md:px-10" />
        </div>
        {errors.opponent && <p className="text-red-600 mt-1 text-right">{errors.opponent}</p>}

        {/* スコア */}
        <div className="flex mt-10 justify-between items-center">
          <label>スコア</label>
          <div className=" items-center flex gap-3 md:gap-10 justify-between">

            <div className="items-center">
              <input
                type="text"
                name="team_score"
                value={form.team_score}
                onChange={handleChange}
                placeholder="自分"
                className="border p-2 w-12" />
            </div>

            <div>
              <p>対</p>
            </div>

            <div className="items-center">
              <input
                type="text"
                name="opponent_score"
                value={form.opponent_score}
                onChange={handleChange}
                placeholder="相手"
                className="border p-2 w-12" />
            </div>
          </div>
        </div>
        {errors.team_score && <p className="text-red-600 mt-1 text-right">{errors.team_score}</p>}
        {errors.opponent_score && <p className="text-red-600 mt-1 text-right">{errors.opponent_score}</p>}

        {/* メモ */}
        <div className="flex flex-col mt-10 justify-between text-left gap-2">
          <label htmlFor="memo">メモ</label>
          <textarea
            id="memo"
            name="memo"
            value={form.memo}
            onChange={handleChange}
            rows={5}
            className="border p-2"
          />
        </div>

        <div className="text-right md:mt-10">
          <button type="submit" className="mt-5 mx-auto w-40 bg-blue-500 hover:bg-blue-600 text-white py-2 rounded transition">
            打撃登録へ
          </button>
        </div>

      </form>
    </div>
  );

}
