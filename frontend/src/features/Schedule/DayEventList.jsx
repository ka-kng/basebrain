import React, { useMemo } from "react";
import ja from "date-fns/locale/ja"; // 日本語ロケール
import { format } from "date-fns"; // 日付フォーマット関数

// 日付ごとのイベント一覧表示コンポーネント
export default function DayEventList({ date, events, onEdit, onDelete, role }) {
  // 選択した日付のイベントだけを抽出（再計算を最小化）
  const dayEvents = useMemo(
    () => events.filter(ev => new Date(ev.start).toDateString() === new Date(date).toDateString()),
    [events, date]
  );

  if (!date) return null;

  return (
    <div className="px-5 xl:pl-0 mt-4 space-y-4">
      <h3 className="text-left text-xl font-semibold mb-2">
        {format(new Date(date), "yyyy年M月d日(EEE)", { locale: ja })}の予定
      </h3>
      {dayEvents.length > 0 ? ( // 該当日の予定があれば
        dayEvents.map(ev => (
          <div key={ev.id} className="text-left py-4 xl:p-0 space-y-2">
            {["集合時間", "内容", "場所", "メモ"].map((label, idx) => (
              <div className="flex border-b border-gray-300 py-1" key={idx}>
                <span className="font-medium w-20 flex-shrink-0">{label}</span>
                <span className="flex-1 break-words">
                  {{
                    "集合時間": ev.extendedProps.time?.slice(0, 5) || "未設定",
                    "内容": ev.extendedProps.type || "未設定",
                    "場所": ev.extendedProps.location || "未設定",
                    "メモ": ev.extendedProps.note || "なし"
                  }[label]}
                </span>
              </div>
            ))}
            {role === "coach" && ( // coachのみ編集・削除ボタン表示
              <div className="flex gap-2 justify-start pt-2">
                <button onClick={() => onEdit(ev)} className="px-2 py-1 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition">編集</button>
                <button onClick={() => onDelete(ev.id)} className="px-2 py-1 bg-red-600 text-white rounded-lg hover:bg-red-700 transition">削除</button>
              </div>
            )}
          </div>
        ))
      ) : (
        <p className="text-left text-gray-400">まだ予定はありません</p> // イベントなし表示
      )}
    </div>
  );
}
