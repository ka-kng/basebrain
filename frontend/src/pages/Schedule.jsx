import React, { useState, useEffect, useMemo } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import axios from "axios";
import ja from "date-fns/locale/ja";
import { format } from "date-fns";

// モーダルコンポーネント
const ScheduleModal = ({ show, onClose, form, onChange, onSubmit, editMode }) => {
  if (!show) return null;
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-3xl w-96 shadow-lg space-y-4">
        <h3 className="text-xl font-semibold text-indigo-600">
          {editMode ? "予定を編集" : "新しい予定を追加"}
        </h3>
        <input type="date" name="date" value={form.date} onChange={onChange} className="border p-2 w-full rounded-xl" />
        <input type="time" name="time" value={form.time} onChange={onChange} className="border p-2 w-full rounded-xl" />
        <input type="text" name="type" placeholder="内容" value={form.type} onChange={onChange} className="border p-2 w-full rounded-xl" />
        <input type="text" name="location" placeholder="場所" value={form.location} onChange={onChange} className="border p-2 w-full rounded-xl" />
        <textarea name="note" placeholder="メモ" value={form.note} onChange={onChange} className="border p-2 w-full rounded-xl" />
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

// 日付ごとのイベントリスト
const DayEventList = ({ date, events, onEdit, onDelete, role }) => {
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
      {dayEvents.length > 0 ? (
        dayEvents.map(ev => (
          <div key={ev.id} className="text-left py-4 xl:p-0 space-y-2">
            {["時間", "内容", "場所", "メモ"].map((label, idx) => (
              <div className="flex border-b border-gray-300 py-1" key={idx}>
                <span className="font-medium w-20 flex-shrink-0">{label}</span>
                <span className="flex-1 break-words">
                  {{"時間": ev.extendedProps.time?.slice(0, 5) || "未設定",
                    "内容": ev.extendedProps.type || "未設定",
                    "場所": ev.extendedProps.location || "未設定",
                    "メモ": ev.extendedProps.note || "なし"}[label]}
                </span>
              </div>
            ))}
            {role === "coach" && (
              <div className="flex gap-2 justify-start pt-2">
                <button onClick={() => onEdit(ev)} className="px-2 py-1 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition">編集</button>
                <button onClick={() => onDelete(ev.id)} className="px-2 py-1 bg-red-600 text-white rounded-lg hover:bg-red-700 transition">削除</button>
              </div>
            )}
          </div>
        ))
      ) : (
        <p className="text-left text-gray-400">まだ予定はありません</p>
      )}
    </div>
  );
};

export default function Schedule() {
  const [events, setEvents] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ date: "", time: "", type: "", location: "", note: "" });
  const [editId, setEditId] = useState(null);
  const [role, setRole] = useState(""); // ユーザーrole

  useEffect(() => {
    // ログイン中ユーザー情報取得
    axios.get("/api/user").then(res => setRole(res.data.role));

    // スケジュール取得
    axios.get("/api/schedules").then(res => {
      setEvents(res.data.map(ev => ({ id: ev.id, start: ev.date, extendedProps: { ...ev } })));
    });
  }, []);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleRegister = () => {
    if (!form.date) return alert("日付を指定してください");
    axios.post("/api/schedules", form).then(res => {
      setEvents([...events, { id: res.data.id, start: res.data.date, extendedProps: res.data }]);
      setShowModal(false);
      setForm({ date: "", time: "", type: "", location: "", note: "" });
    });
  };

  const handleUpdate = () => {
    axios.put(`/api/schedules/${editId}`, form).then(res => {
      setEvents(events.map(ev => (ev.id === editId ? { ...ev, extendedProps: res.data, start: res.data.date } : ev)));
      setEditId(null);
      setShowModal(false);
      setForm({ date: "", time: "", type: "", location: "", note: "" });
    });
  };

  const handleDelete = id => {
    axios.delete(`/api/schedules/${id}`).then(() => setEvents(events.filter(ev => ev.id !== id)));
  };

  const handleEdit = ev => {
    setForm({ ...ev.extendedProps, date: ev.start });
    setEditId(ev.id);
    setShowModal(true);
  };

  return (
    <div className="max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-800 border-b-4 border-green-500 inline-block pb-2 mb-10">
        スケジュール
      </h1>

      <FullCalendar
        plugins={[dayGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        locale="ja"
        dateClick={arg => setSelectedDate(arg.dateStr)}
        height="auto"
        headerToolbar={{ left: "title", center: "", right: "today prev,next" }}
        titleFormat={{ year: "numeric", month: "long" }}
        dayCellClassNames={arg => (arg.date.getDay() === 6 ? ["bg-blue-100"] : arg.date.getDay() === 0 ? ["bg-red-100"] : [])}
        dayCellContent={arg => {
          const hasEvent = events.some(ev => new Date(ev.start).toDateString() === arg.date.toDateString());
          return (
            <div className="relative w-full h-full flex flex-col items-center justify-center">
              <div className="text-sm font-medium">{arg.dayNumberText}</div>
              {hasEvent && <div className="w-2 h-2 bg-gray-500 rounded-full mt-1" />}
            </div>
          );
        }}
      />

      <DayEventList
        date={selectedDate}
        events={events}
        onEdit={handleEdit}
        onDelete={handleDelete}
        role={role}
      />

      {/* coachのみ、新規追加ボタン */}
      {role === "coach" && (
        <button
          onClick={() => { setShowModal(true); setForm({ date: "", time: "", type: "", location: "", note: "" }); setEditId(null); }}
          className="fixed bottom-20 xl:bottom-6 right-6 w-14 h-14 bg-indigo-600 text-white rounded-full shadow-lg flex items-center pb-2 justify-center text-4xl hover:bg-indigo-700 transition z-50"
        >+</button>
      )}

      <ScheduleModal
        show={showModal}
        onClose={() => setShowModal(false)}
        form={form}
        onChange={handleChange}
        onSubmit={editId ? handleUpdate : handleRegister}
        editMode={!!editId}
      />
    </div>
  );
}
