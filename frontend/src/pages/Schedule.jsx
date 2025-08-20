import React, { useEffect, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import axios from "axios";

function Modal({ children, onClose }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center">
      <div className="bg-white p-6 rounded-xl shadow-lg w-96">
        {children}
        <div className="mt-4 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
          >
            閉じる
          </button>
        </div>
      </div>
    </div>
  );
}

// 時間を「9:00」形式に変換する関数
function formatTime(time) {
  if (!time) return "";
  const [hour, minute] = time.split(":"); // "09:00:00" → ["09","00","00"]
  return `${parseInt(hour, 10)}:${minute}`;
}

export default function Schedule() {
  const [events, setEvents] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [role, setRole] = useState("coach"); // ← ロール。ここを "player" にすると登録ボタン非表示
  const [form, setForm] = useState({
    time: "",
    type: "",
    location: "",
    note: "",
  });

  // 初回読み込み時にイベント取得
  useEffect(() => {
    axios.get("/api/schedules").then((res) => {
      setEvents(
        res.data.map((s) => ({
          id: s.id,
          title: `${formatTime(s.time) || "時間未設定"}~集合  ${
            s.location || "場所未設定"
          }`,
          start: s.date,
          extendedProps: {
            type: s.type,
            note: s.note,
            location: s.location,
            time: s.time,
          },
        }))
      );
    });
  }, []);

  // 日付クリック時
  const handleDateClick = (arg) => {
    setSelectedDate(arg.dateStr);
    setModalOpen(true);
  };

  // 入力フォーム変更時
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // 登録処理（コーチのみ）
  const handleRegister = () => {
    axios
      .post("/api/schedules", { date: selectedDate, ...form })
      .then((res) => {
        const newEvent = {
          id: res.data.id,
          title: `${formatTime(res.data.time) || "時間未設定"} @ ${
            res.data.location || "場所未設定"
          }`,
          start: res.data.date,
          extendedProps: {
            type: res.data.type,
            note: res.data.note,
            location: res.data.location,
            time: res.data.time,
          },
        };
        setEvents([...events, newEvent]);
        setForm({ time: "", type: "", location: "", note: "" });
        setModalOpen(false);
      });
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">スケジュール</h2>
      <FullCalendar
        plugins={[dayGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        initialDate={new Date().toISOString().split("T")[0]} // ← 今日の日付をセット
        events={events}
        dateClick={handleDateClick}
      />

      {modalOpen && (
        <Modal onClose={() => setModalOpen(false)}>
          <h3 className="text-xl font-bold mb-2">
            {selectedDate} の予定
          </h3>

          {/* 予定表示部分 */}
          <ul className="mb-4">
            {events
              .filter((ev) => ev.start === selectedDate)
              .map((ev) => (
                <li key={ev.id} className="border p-2 mb-1 rounded">
                  <p>
                    <strong>時間:</strong> {formatTime(ev.extendedProps.time)}
                  </p>
                  <p>
                    <strong>内容:</strong> {ev.extendedProps.type || "未設定"}
                  </p>
                  <p>
                    <strong>場所:</strong>{" "}
                    {ev.extendedProps.location || "未設定"}
                  </p>
                  <p>
                    <strong>メモ:</strong> {ev.extendedProps.note || "なし"}
                  </p>
                </li>
              ))}
          </ul>

          {/* コーチのみ登録フォーム表示 */}
          {role === "coach" && (
            <>
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
              ></textarea>

              <button
                onClick={handleRegister}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                登録
              </button>
            </>
          )}
        </Modal>
      )}
    </div>
  );
}
