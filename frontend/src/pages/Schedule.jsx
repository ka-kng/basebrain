import { useState, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import axios from "axios";

// モーダルコンポーネント
function Modal({ children, onClose }) {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 p-4">
      <div className="bg-white p-5 rounded-lg shadow-lg w-full max-w-xs sm:max-w-sm">
        {children}
        <button
          onClick={onClose}
          className="mt-4 w-full bg-gray-300 hover:bg-gray-400 px-5 py-3 rounded-lg text-lg font-medium"
        >
          閉じる
        </button>
      </div>
    </div>
  );
}

// 時間補正関数
const formatTime = (t) => {
  if (!t) return "";
  const times = t.split("~").map((part) => {
    const s = part.trim();
    if (/^\d{1,2}$/.test(s)) return s.padStart(2, "0") + ":00";
    if (/^\d{1,2}:\d{1,2}$/.test(s)) {
      const [h, m] = s.split(":");
      return h.padStart(2, "0") + ":" + m.padStart(2, "0");
    }
    if (/^\d{3,4}$/.test(s)) {
      const h = s.length === 3 ? s.slice(0, 1) : s.slice(0, 2);
      const m = s.length === 3 ? s.slice(1) : s.slice(2);
      return h.padStart(2, "0") + ":" + m.padStart(2, "0");
    }
    return s;
  });
  return times.join("~");
};

// スケジュールコンポーネント
export default function Schedule() {
  const [userRole, setUserRole] = useState("");
  const [events, setEvents] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);

  const [type, setType] = useState("");
  const [time, setTime] = useState("");
  const [location, setLocation] = useState("");
  const [note, setNote] = useState("");

  const isCoach = userRole?.toLowerCase() === "coach";

  // ユーザー情報取得
  useEffect(() => {
    axios.get("/api/user")
      .then(res => setUserRole(res.data.role))
      .catch(err => console.error(err));
  }, []);

  // スケジュール取得
  useEffect(() => {
    axios.get("/api/schedules")
      .then(res => {
        const loadedEvents = res.data.map(s => {
          let start = s.date;
          let end = s.date;
          if (s.time) {
            const times = formatTime(s.time).split("~");
            start += "T" + times[0];
            end += "T" + (times[1] || times[0]);
          }
          return {
            id: s.id,
            title: `${s.type || "内容未設定"} @ ${s.location || "場所未設定"}`,
            start,
            end,
            extendedProps: {
              type: s.type,
              time: formatTime(s.time),
              location: s.location,
              note: s.note,
            },
          };
        });
        setEvents(loadedEvents);
      })
      .catch(err => console.error(err));
  }, []);

  // 日付クリック（新規）
  const handleDateClick = (info) => {
    setSelectedDate(info.dateStr);
    setSelectedEvent(null);
    setType("");
    setTime("");
    setLocation("");
    setNote("");
    setShowModal(true);
  };

  // イベントクリック（既存）
  const handleEventClick = (clickInfo) => {
    const ev = clickInfo.event;
    setSelectedEvent(ev);
    setSelectedDate(ev.startStr.slice(0, 10));
    setType(ev.extendedProps.type || "");
    setTime(ev.extendedProps.time || "");
    setLocation(ev.extendedProps.location || "");
    setNote(ev.extendedProps.note || "");
    setShowModal(true);
  };

  // 保存（新規 or 更新）
  const handleSave = async (e) => {
    e.preventDefault();
    const correctedTime = formatTime(time);

    if (selectedEvent) {
      // 更新
      try {
        const res = await axios.put(`/api/schedules/${selectedEvent.id}`, {
          type, time: correctedTime, location, note
        });
        setEvents(events.map(ev =>
          ev.id === res.data.id
            ? {
                ...ev,
                title: `${res.data.type} @ ${res.data.location || "場所未設定"}`,
                extendedProps: {
                  type: res.data.type,
                  time: formatTime(res.data.time),
                  location: res.data.location,
                  note: res.data.note,
                },
              }
            : ev
        ));
        setShowModal(false);
      } catch (err) {
        console.error(err);
      }
    } else {
      // 新規作成
      try {
        const res = await axios.post("/api/schedules", {
          date: selectedDate,
          type, time: correctedTime, location, note
        });
        const times = correctedTime.split("~");
        setEvents([
          ...events,
          {
            id: res.data.id,
            title: `${res.data.type} @ ${res.data.location || "場所未設定"}`,
            start: res.data.date + (times[0] ? "T" + times[0] : ""),
            end: res.data.date + (times[1] ? "T" + times[1] : ""),
            extendedProps: {
              type: res.data.type,
              time: correctedTime,
              location: res.data.location,
              note: res.data.note,
            },
          }
        ]);
        setShowModal(false);
      } catch (err) {
        console.error(err);
      }
    }

    setSelectedEvent(null);
    setType("");
    setTime("");
    setLocation("");
    setNote("");
  };

  // 削除
  const handleDelete = async () => {
  if (!selectedEvent) return;
  try {
    await axios.delete(`/api/schedules/${selectedEvent.id}`);

    // FullCalendar のイベント自体を削除
    selectedEvent.remove();

    // React state も更新
    setEvents(prev => prev.filter(ev => ev.id !== selectedEvent.id));

    setShowModal(false);
  } catch (err) {
    console.error(err);
  }
};

  if (!userRole) return null;

  return (
    <div className="p-5 max-w-screen-lg mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-center">スケジュール</h1>

      <FullCalendar
        plugins={[dayGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        initialDate="2025-08-01"
        headerToolbar={{ left: "prev,next today", center: "title", right: "" }}
        events={events}
        dateClick={handleDateClick}
        eventClick={handleEventClick}
        height="auto"
      />

      {showModal && (
        <Modal onClose={() => setShowModal(false)}>
          <h2 className="text-2xl font-bold mb-4">
            {isCoach ? (selectedEvent ? "予定更新" : "予定登録") : "予定詳細"}
          </h2>
          <p className="text-lg mb-3">日付：{selectedDate}</p>

          {isCoach ? (
            <form onSubmit={handleSave} className="flex flex-col gap-3">
              <input
                value={type}
                onChange={(e) => setType(e.target.value)}
                placeholder="内容 例: 練習試合 vs ○○高校"
                className="border rounded-lg p-3 text-lg"
                required
              />
              <input
                value={time}
                onChange={(e) => setTime(e.target.value)}
                placeholder="時間 例: 10:00~12:00"
                className="border rounded-lg p-3 text-lg"
                onBlur={() => setTime(formatTime(time))}
              />
              <input
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="場所 例: ○○球場"
                className="border rounded-lg p-3 text-lg"
              />
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="メモ 例: 試合開始30分前集合"
                className="border rounded-lg p-3 text-lg"
              />
              <div className="flex gap-3">
                <button
                  type="submit"
                  className="bg-blue-600 text-white text-lg font-bold py-3 rounded-lg mt-3 flex-1"
                >
                  {selectedEvent ? "更新" : "登録"}
                </button>
                {selectedEvent && (
                  <button
                    type="button"
                    onClick={handleDelete}
                    className="bg-red-600 text-white text-lg font-bold py-3 rounded-lg mt-3 flex-1"
                  >
                    削除
                  </button>
                )}
              </div>
            </form>
          ) : (
            <div className="flex flex-col gap-3 text-left">
              {selectedEvent ? (
                <div className="border rounded-lg p-3 bg-gray-50 shadow-sm text-lg">
                  <p>時間：{selectedEvent.extendedProps.time || "-"}</p>
                  <p>内容：{selectedEvent.extendedProps.type}</p>
                  <p>場所：{selectedEvent.extendedProps.location || "-"}</p>
                  <p>メモ：{selectedEvent.extendedProps.note || "-"}</p>
                </div>
              ) : (
                <p className="text-lg">この日にイベントはありません</p>
              )}
            </div>
          )}
        </Modal>
      )}
    </div>
  );
}
