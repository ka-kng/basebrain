import { useEffect, useState } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";

export default function SummaryRecord() {
  const navigate = useNavigate();
  const [game, setGame] = useState(null);
  const [batters, setBatters] = useState([]);
  const [pitchers, setPitchers] = useState([]);

  // const location = useLocation();
  // const game_id = location.state?.game_id;

  // useEffect(() => {
  //   axios.get('/api/records/summary')
  //     .then(res => {
  //       setGame(res.data.game);
  //       setBatters(res.data.batters);
  //       setPitchers(res.data.pitchers);
  //     })
  //     .catch(() => {
  //       navigate('/records/game');
  //     });
  // }, [navigate]);

  // if (!game) return <p>読み込み中...</p>

  return (
    <div className="px-10 pt-10 pb-20">
      <div className="flex justify-between">
        <button className="block text-left text-xl" onClick={() => navigate(-1)}>戻る</button>
        <div className="mb-5 text-right">
          <button
            type="button"
            onClick={() => navigate('/records/summary')}
            className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded"
          >
            試合一覧へ
          </button>
        </div>
      </div>
      <h1 className="text-2xl mt-10">登録結果まとめ</h1>

      {/* 公式戦 */}
      <div className="flex flex-col mt-10 gap-5 text-left">
        <span>公式戦：</span>
        <span>公式戦：</span>
      </div>

    </div>
  );

}
