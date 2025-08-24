export default function GameSummary({ game }) {
  return (
    <>
      {/* 試合概要 */}
      <div className="my-10 bg-white shadow-md rounded-xl p-5 hover:shadow-xl transition">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-gray-500">{game.formatted_date}</span>
          <span className="px-3 py-1 text-xs font-bold rounded-full bg-gray-100 text-gray-600">{game.game_type}</span>
        </div>
        <h2 className="text-lg font-semibold text-gray-800">{game.tournament}</h2>
        <p className="text-sm text-gray-500 my-3">試合結果：<span className="ml-2 px-2 py-1 font-bold text-gray-600">{game.result}</span></p>
        <div className="flex justify-between items-center bg-gray-50 rounded-lg p-3 mb-3">
          <div className="text-center flex-1">
            <p className="font-bold">{game.team?.name}</p>
            <p className="text-2xl font-bold text-green-600">{game.team_score}</p>
          </div>
          <span className="text-lg font-bold text-gray-500">vs</span>
          <div className="text-center flex-1">
            <p className="font-bold">{game.opponent}</p>
            <p className="text-2xl font-bold text-red-600">{game.opponent_score}</p>
          </div>
        </div>
        <p className="text-sm text-gray-600 text-left">{game.memo}</p>
      </div>
    </>
  );
}
