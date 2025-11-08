// スタットカードコンポーネント（ラベルと値を表示）
export default function StatCard({ label, value, color }) {
  return (
    <div className="flex justify-between items-center bg-white p-4 rounded-lg shadow-md">
      <span className={`font-semibold ${color || "text-gray-700"}`}>{label}</span>
      <span className={`font-bold text-lg ${color || "text-gray-800"}`}>{value}</span>
    </div>
  )
}
