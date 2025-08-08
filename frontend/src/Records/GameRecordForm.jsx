import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function GameRecordForm() {
  const navigate = useNavigate();

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

    try {

      await axios.post('/api/game', form);
      alert('登録成功');

    } catch (err) {

      console.log(err);
      alert('登録失敗');

    }
  };

  return (
    <div>
      <button className="block text-left text-xl" onClick={handleBack}>戻る</button>
      <h1 className="text-2xl mt-10">試合結果</h1>
      <form onSubmit={handleSubmit} className="space-y-4">

        <div className="flex mt-10 justify-between px-10 items-center">
          <label htmlFor="date">試合日</label>
          <input
          id="date"
          type="date"
          name="date"
          value={form.date}
          onChange={handleChange}
          className="border p-2 md:px-10" />
        </div>

        <div className="flex mt-10 justify-between px-10 items-center">

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
      </form>
    </div>
  );

}
