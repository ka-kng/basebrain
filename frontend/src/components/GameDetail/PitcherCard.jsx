export default function PitcherCard({ pitcher, open, toggleOpen, onDelete, navigate, stats }) {
  const { formatInnings, calcERA, calcK9, calcBB9 } = stats;
  return (
    <div className="bg-white shadow-md rounded-xl p-5 hover:shadow-xl transition">
      <div className="flex justify-between items-center mb-2">
        <h3 className="font-semibold">{pitcher.user.name} ({formatInnings(pitcher.pitching_innings_outs)}回)</h3>
        <div className="flex gap-3">
          <button onClick={() => navigate(`/records/pitching/${pitcher.id}/edit`)} className="text-blue-500 text-sm hover:underline">編集</button>
          <button onClick={onDelete} className="text-red-500 text-sm hover:underline">削除</button>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-2">
        <div><p>防御率</p><span className="font-bold">{calcERA(pitcher.earned_runs, pitcher.pitching_innings_outs)}</span></div>
        <div><p>奪三振率</p><span className="font-bold">{calcK9(pitcher.strikeouts, pitcher.pitching_innings_outs)}</span></div>
        <div><p>与四死球率</p><span className="font-bold">{calcBB9(pitcher.walks_given, pitcher.pitching_innings_outs)}</span></div>
      </div>
      <div className="text-right">
        <button onClick={toggleOpen} className="text-blue-600 text-sm hover:underline mt-3">{open ? "▲ 詳細を閉じる" : "▼ 詳細を見る"}</button>
      </div>
      {open && (
        <div className="mt-2 grid grid-cols-1 gap-1 text-gray-700">
          <div className="flex justify-between"><span>球数</span><span>{pitcher.pitches}</span></div>
          <div className="flex justify-between"><span>奪三振</span><span>{pitcher.strikeouts}</span></div>
          <div className="flex justify-between"><span>被安打</span><span>{pitcher.hits_allowed}</span></div>
          <div className="flex justify-between"><span>被本塁打</span><span>{pitcher.hr_allowed}</span></div>
          <div className="flex justify-between"><span>与四死球</span><span>{pitcher.walks_given}</span></div>
          <div className="flex justify-between"><span>失点</span><span>{pitcher.runs_allowed}</span></div>
          <div className="flex justify-between"><span>自責点</span><span>{pitcher.earned_runs}</span></div>
        </div>
      )}
    </div>
  );
}
