import React, { useEffect, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import axios from "axios";
import { format } from "date-fns";
import ja from "date-fns/locale/ja";

// 時間整形
function formatTime(time) {
  if (!time) return "";
  const [hour, minute] = time.split(":");
  return `${parseInt(hour, 10)}:${minute}`;
}

export default function Schedule() {
  const [events, setEvents] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [role, setRole] = useState("coach");
  const [form, setForm] = useState({ date: "", time: "", type: "", location: "", note: "" });
  const [editEventId, setEditEventId] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    axios.get("/api/user").then((res) => setRole(res.data.role));
    axios.get("/api/schedules").then((res) =>
      setEvents(
        res.data.map((s) => ({
          id: s.id,
          start: s.date,
          title: `${formatTime(s.time) || "時間未設定"} ${s.type || "内容未設定"}`,
          extendedProps: { ...s },
        }))
      )
    );
  }, []);

  const handleDateClick = (arg) => setSelectedDate(arg.dateStr);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleRegister = () => {
    if (!form.date) return alert("日付を指定してください");
    const dayEvents = events.filter((ev) => ev.start === form.date);
    if (dayEvents.length >= 3) return alert("1日に登録できる予定は最大3件です");

    axios
      .post("/api/schedules", form)
      .then((res) =>
        setEvents([
          ...events,
          {
            id: res.data.id,
            start: res.data.date,
            title: `${formatTime(res.data.time) || "時間未設定"} ${res.data.type || "内容未設定"}`,
            extendedProps: { ...res.data },
          },
        ])
      )
      .finally(() => setForm({ date: "", time: "", type: "", location: "", note: "" }));
  };

  const handleEdit = (ev) => {
    if (role !== "coach") return;
    setForm({ ...ev.extendedProps, date: ev.start });
    setEditEventId(ev.id);
    setShowModal(true);
  };

  const handleUpdate = () => {
    if (!editEventId) return;
    axios
      .put(`/api/schedules/${editEventId}`, form)
      .then((res) =>
        setEvents(
          events.map((ev) =>
            ev.id === editEventId
              ? { ...ev, title: `${formatTime(res.data.time)} ${res.data.type}`, extendedProps: { ...res.data } }
              : ev
          )
        )
      )
      .finally(() => {
        setEditEventId(null);
        setForm({ date: "", time: "", type: "", location: "", note: "" });
      });
  };

  const handleDelete = (ev) => {
    if (role !== "coach") return;
    if (!window.confirm("本当に削除しますか？")) return;
    axios.delete(`/api/schedules/${ev.id}`).then(() => setEvents(events.filter((item) => item.id !== ev.id)));
  };

  const dayEvents = selectedDate ? events.filter((ev) => ev.start === selectedDate) : [];

  return (
    <div className="pb-16 max-w-md mx-auto">
      <h2 className="text-3xl font-extrabold mb-4 text-center text-indigo-600">📅 スケジュール</h2>

      <div className="overflow-hidden rounded-3xl shadow-lg">
        <FullCalendar
          plugins={[dayGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          locale="ja"
          events={events}
          dateClick={handleDateClick}
          height="500px"
          dayMaxEvents={true}
          eventDisplay="block"
          eventContent={() => <div className="w-2 h-2 bg-indigo-500 rounded-full mx-auto mt-1" />}
          headerToolbar={{ left: "prev,next today", center: "title", right: "" }}
          titleFormat={{ year: "numeric", month: "long" }}
          dayCellClassNames={(arg) => {
            if (arg.date.getDay() === 6) return ["bg-blue-100"];
            if (arg.date.getDay() === 0) return ["bg-red-100"];
            return [];
          }}
        />
      </div>

      {/* 選択日詳細 */}
      {selectedDate && (
        <div className="mt-3 space-y-2">
          {dayEvents.length > 0 ? dayEvents.map((ev) => (
            <div key={ev.id} className="bg-white rounded-2xl shadow-md">
              <div className="border-b border-indigo-200 p-2 flex justify-between">
                <span className="font-medium">日付</span>
                <span>{format(new Date(ev.start), "yyyy/MM/dd", { locale: ja })}</span>
              </div>
              <div className="border-b border-indigo-200 p-2 flex justify-between">
                <span className="font-medium">時間</span>
                <span>{formatTime(ev.extendedProps.time)}</span>
              </div>
              <div className="border-b border-indigo-200 p-2 flex justify-between">
                <span className="font-medium">内容</span>
                <span>{ev.extendedProps.type || "未設定"}</span>
              </div>
              <div className="border-b border-indigo-200 p-2 flex justify-between">
                <span className="font-medium">場所</span>
                <span>{ev.extendedProps.location || "未設定"}</span>
              </div>
              <div className="border-b border-indigo-200 p-2 flex justify-between">
                <span className="font-medium">メモ</span>
                <span>{ev.extendedProps.note || "なし"}</span>
              </div>
              {role === "coach" && (
                <div className="flex gap-2 justify-end p-2">
                  <button onClick={() => handleEdit(ev)} className="px-2 py-1 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition">編集</button>
                  <button onClick={() => handleDelete(ev)} className="px-2 py-1 bg-red-600 text-white rounded-lg hover:bg-red-700 transition">削除</button>
                </div>
              )}
            </div>
          )) : (
            <p className="text-center text-gray-400">まだ予定はありません</p>
          )}
        </div>
      )}

      {/* フローティング＋ボタン */}
      {role === "coach" && (
        <button
          onClick={() => { setForm({ date: "", time: "", type: "", location: "", note: "" }); setEditEventId(null); setShowModal(true); }}
          className="fixed bottom-20 right-6 w-14 h-14 bg-indigo-600 text-white rounded-full shadow-lg flex items-center justify-center text-3xl hover:bg-indigo-700 transition z-50"
        >
          +
        </button>
      )}
    </div>
  );
}
