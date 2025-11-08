// NumberInput 数値入力フォームをまとめて共通化したもの
export default function NumberInput({ label, name, value, onChange, unit, note, error }) {
  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center justify-between">
        <label htmlFor={name} className="">{label}</label>
        <div className="flex items-center gap-2">
          <input
            id={name}
            name={name}
            type="number"
            min={0}
            value={value}
            onChange={onChange}
            className={`w-20 border p-2 rounded text-center ${error ? "border-red-500" : ""}`}
            aria-invalid={!!error}
          />
          <span className="text-gray-600">{unit}</span>
        </div>
      </div>
      {note && <p className="text-left text-gray-500 text-xs">{note}</p>}
      {error && <p className="text-left text-red-500 text-sm mt-1">{error}</p>}
    </div>
  )
}
