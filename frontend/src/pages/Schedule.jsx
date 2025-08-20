import React, { useEffect, useState, useRef } from "react";
import { createPortal } from "react-dom";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import axios from "axios";

// モーダルコンポーネント
function Modal({ children, onClose }) {
  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  return createPortal(
    <div
      className="fixed inset-0 z-[9999] flex justify-center items-center bg-black bg-opacity-40"
      onClick={handleOverlayClick}
    >
      <div className="bg-white p-6 rounded-xl shadow-lg w-96 max-w-full relative max-h-[80vh] overflow-auto">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 text-lg font-bold"
        >
          ✕
        </button>
        {children}
      </div>
    </div>,
    document.body
  );
}

// 時間整形
function formatTime(time) {
  if (!time) return "";
  const [hour, minute] = time.split(":");
  return `${parseInt(hour, 10)}:${minute}`;
}


export default function Schedule() {
  const [events, setEvents] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [role, setRole] = useState("coach"); // "player" にすると確認のみ
  const [form, setForm] = useState({ time: "", type: "", location: "", note: "" });
  const [editEventId, setEditEventId] = useState(null);
  const formRef = useRef(null);



  // 初回読み込みで予定取得
  useEffect(() => {

    axios.get("/api/user").then((res) => {
      setRole(res.data.role); // "coach" or "player"
    });

    axios.get("/api/schedules").then((res) => {
      setEvents(
        res.data.map((s) => ({
          id: s.id,
          start: s.date,
          title: `${formatTime(s.time) || "時間未設定"} ${s.type || "内容未設定"}`,
          extendedProps: {
            time: s.time,
            type: s.type,
            location: s.location,
            note: s.note,
          },
        }))
      );
    });
  }, []);

  const handleDateClick = (arg) => {
    setSelectedDate(arg.dateStr);
    setModalOpen(true);
    setForm({ time: "", type: "", location: "", note: "" });
    setEditEventId(null);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // 登録
  const handleRegister = () => {
    const dayEvents = events.filter((ev) => ev.start === selectedDate);
    if (dayEvents.length >= 3) {
      alert("1日に登録できる予定は最大3件です");
      return;
    }

    axios
      .post("/api/schedules", { date: selectedDate, ...form })
      .then((res) => {
        const newEvent = {
          id: res.data.id,
          start: res.data.date,
          title: `${formatTime(res.data.time) || "時間未設定"} ${res.data.type || "内容未設定"
            }`,
          extendedProps: {
            time: res.data.time,
            type: res.data.type,
            location: res.data.location,
            note: res.data.note,
          },
        };
        setEvents([...events, newEvent]);
        setForm({ time: "", type: "", location: "", note: "" });
      })
      .catch(() => alert("登録失敗"));
  };

  // 編集開始
  const handleEdit = (ev) => {
    if (role !== "coach") return;
    setForm({
      time: ev.extendedProps.time || "",
      type: ev.extendedProps.type || "",
      location: ev.extendedProps.location || "",
      note: ev.extendedProps.note || "",
    });
    setEditEventId(ev.id);

    // フォームにスクロール
    setTimeout(() => {
      formRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 50);
  };

  // 更新
  const handleUpdate = () => {
    if (!editEventId) return;
    axios
      .put(`/api/schedules/${editEventId}`, form)
      .then((res) => {
        setEvents(
          events.map((ev) =>
            ev.id === editEventId
              ? {
                ...ev,
                title: `${formatTime(res.data.time) || "時間未設定"} ${res.data.type || "内容未設定"
                  }`,
                extendedProps: { ...res.data },
              }
              : ev
          )
        );
        setEditEventId(null);
        setForm({ time: "", type: "", location: "", note: "" });
      })
      .catch(() => alert("更新失敗"));
  };

  // 削除
  const handleDelete = (ev) => {
    if (role !== "coach") return;
    if (!window.confirm("本当に削除しますか？")) return;
    axios
      .delete(`/api/schedules/${ev.id}`)
      .then(() => setEvents(events.filter((item) => item.id !== ev.id)))
      .catch(() => alert("削除失敗"));
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">スケジュール</h2>
      <FullCalendar
        plugins={[dayGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        initialDate={new Date().toISOString().split("T")[0]}
        events={events}
        dateClick={handleDateClick}
      />

      {modalOpen && (
        <Modal onClose={() => setModalOpen(false)}>
          <h3 className="text-xl font-bold mb-2">{selectedDate} の予定</h3>

          {/* 予定一覧 */}
          <ul className="mb-4 max-h-[250px] overflow-auto">
            {events
              .filter((ev) => ev.start === selectedDate)
              .map((ev) => (
                <li key={ev.id} className="border p-2 mb-2 rounded">
                  <p>
                    <strong>時間:</strong> {formatTime(ev.extendedProps.time)}
                  </p>
                  <p>
                    <strong>内容:</strong> {ev.extendedProps.type || "未設定"}
                  </p>
                  <p>
                    <strong>場所:</strong> {ev.extendedProps.location || "未設定"}
                  </p>
                  <p>
                    <strong>メモ:</strong> {ev.extendedProps.note || "なし"}
                  </p>

                  {role === "coach" && (
                    <div className="flex gap-2 mt-2">
                      <button
                        onClick={() => handleEdit(ev)}
                        className="px-3 py-1 bg-yellow-500 text-white rounded"
                      >
                        編集
                      </button>
                      <button
                        onClick={() => handleDelete(ev)}
                        className="px-3 py-1 bg-red-600 text-white rounded"
                      >
                        削除
                      </button>
                    </div>
                  )}
                </li>
              ))}
          </ul>

          {/* 新規登録 or 更新フォーム（coachのみ） */}
          {role === "coach" && (
            <div ref={formRef}>
              <h4 className="font-semibold mb-2">
                {editEventId ? "予定を編集" : "新しい予定を追加"}
              </h4>
              <input
                type="time"
                name="time"
                value={form.time}
                onChange={handleChange}
                className="border p-2 w-full mb-2"
              />
              <input
                type="text"
                name="type"
                placeholder="内容"
                value={form.type}
                onChange={handleChange}
                className="border p-2 w-full mb-2"
              />
              <input
                type="text"
                name="location"
                placeholder="場所"
                value={form.location}
                onChange={handleChange}
                className="border p-2 w-full mb-2"
              />
              <textarea
                name="note"
                placeholder="メモ"
                value={form.note}
                onChange={handleChange}
                className="border p-2 w-full mb-2"
              />

              <button
                onClick={editEventId ? handleUpdate : handleRegister}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                {editEventId ? "更新" : "登録"}
              </button>
            </div>
          )}
        </Modal>
      )}
    </div>
  );
}
