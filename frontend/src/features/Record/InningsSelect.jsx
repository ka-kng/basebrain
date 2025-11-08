// 投球回数セレクト
export const InningsSelect = ({ value, onChange, error }) => (
  <>
    <select
      id="pitching_innings_outs"
      name="pitching_innings_outs"
      value={value}
      onChange={onChange}
      className={`border p-2 rounded w-full ${error ? "border-red-500" : ""}`}
      aria-invalid={!!error}
    >
      <option value="">選択</option>
      {Array.from({ length: 36 }, (_, i) => {
        const full = Math.floor(i / 3);
        const third = (i % 3) + 1;
        const label = third === 3 ? `${full + 1}` : `${full} ${third}/3`;
        return <option key={i} value={i + 1}>{label}</option>;
      })}
    </select>
    {error && <p className="text-left text-red-500 text-sm mt-1">{error}</p>}
  </>
);
