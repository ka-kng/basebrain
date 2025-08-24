export default function BatterCard({ batter, open, toggleOpen, onDelete, navigate, stats }) {
  const { calcBattingAverage, calcOnBasePercentage, calcStealPercentage, calcSlugging, calcOPS } = stats;
  return (
    <div className="bg-white shadow-md rounded-xl p-5 hover:shadow-xl transition">
      <div className="flex justify-between items-center mb-2">
        <h3 className="font-semibold">{batter.user.name} ({batter.order_no}番 / {batter.position})</h3>
        <div className="flex gap-3">
          <button onClick={() => navigate(`/records/batting/${batter.id}/edit`)} className="text-blue-500 text-sm hover:underline">編集</button>
          <button onClick={onDelete} className="text-red-500 text-sm hover:underline">削除</button>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-2 mb-2">
        <div><p>打率</p><span className="font-bold">{calcBattingAverage(batter.hits + batter.doubles + batter.triples + batter.home_runs, batter.at_bats)}</span></div>
        <div><p>出塁率</p><span className="font-bold">{calcOnBasePercentage(batter.hits + batter.doubles + batter.triples + batter.home_runs, batter.walks, batter.at_bats)}</span></div>
        <div><p>盗塁率</p><span className="font-bold">{calcStealPercentage(batter.steals, batter.caught_stealing)}</span></div>
        <div><p>長打率</p><span className="font-bold">{calcSlugging(batter.hits, batter.doubles, batter.triples, batter.home_runs, batter.at_bats)}</span></div>
        <div><p>OPS</p><span className="font-bold">{calcOPS(batter.hits, batter.doubles, batter.triples, batter.home_runs, batter.walks, batter.at_bats)}</span></div>
      </div>
      <div className="text-right">
        <button onClick={toggleOpen} className="text-blue-600 text-sm hover:underline mt-3">{open ? "▲ 詳細を閉じる" : "▼ 詳細を見る"}</button>
      </div>
      {open && (
        <div className="mt-2 grid grid-cols-1 gap-1 text-gray-700">
          <div className="flex justify-between"><span>打数</span><span>{batter.at_bats}</span></div>
          <div className="flex justify-between"><span>一塁打</span><span>{batter.hits}</span></div>
          <div className="flex justify-between"><span>二塁打</span><span>{batter.doubles}</span></div>
          <div className="flex justify-between"><span>三塁打</span><span>{batter.triples}</span></div>
          <div className="flex justify-between"><span>本塁打</span><span>{batter.home_runs}</span></div>
          <div className="flex justify-between"><span>打点</span><span>{batter.rbis}</span></div>
          <div className="flex justify-between"><span>得点</span><span>{batter.runs}</span></div>
          <div className="flex justify-between"><span>四死球</span><span>{batter.walks}</span></div>
          <div className="flex justify-between"><span>三振</span><span>{batter.strikeouts}</span></div>
          <div className="flex justify-between"><span>盗塁数</span><span>{batter.steals}</span></div>
          <div className="flex justify-between"><span>盗塁成功数</span><span>{batter.caught_stealing}</span></div>
          <div className="flex justify-between"><span>失策</span><span>{batter.errors}</span></div>
        </div>
      )}
    </div>
  );
}
