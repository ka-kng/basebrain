// モーダルコンポーネント（新規追加・編集兼用）
export default function Modal({ show, onClose, form, onChange, onSubmit, editMode }) {
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-3xl w-96 shadow-lg space-y-4">
        {/* モードによってタイトル切り替え*/}
        <h3 className="text-xl font-semibold text-indigo-600">
          {editMode ? "予定を編集" : "新しい予定を追加"}
        </h3>

        {/* 入力フィールド群 */}
        <input type="date" name="date" value={form.date} onChange={onChange} className="border p-2 w-full rounded-xl" />
        <input type="time" name="time" value={form.time} onChange={onChange} className="border p-2 w-full rounded-xl" />
        <input type="text" name="type" placeholder="内容 例；練習試合 vs ○○高校" value={form.type} onChange={onChange} className="border p-2 w-full rounded-xl" />
        <input type="text" name="location" placeholder="場所 例：○○球場" value={form.location} onChange={onChange} className="border p-2 w-full rounded-xl" />
        <textarea name="note" placeholder="メモ" value={form.note} onChange={onChange} className="border p-2 w-full rounded-xl" />

        {/* キャンセル・追加/更新ボタン */}
        <div className="flex justify-end gap-2">
          <button onClick={onClose} className="px-4 py-2 bg-gray-300 rounded-xl hover:bg-gray-400 transition">キャンセル</button>
          <button onClick={onSubmit} className="px-4 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition">
            {editMode ? "更新" : "追加"}
          </button>
        </div>

      </div>
    </div>
  );
};
