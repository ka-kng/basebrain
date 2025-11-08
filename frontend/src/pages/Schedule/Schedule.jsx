import React, { useState, useEffect, useMemo } from "react";
import FullCalendar from "@fullcalendar/react"; // FullCalendarコンポーネント
import dayGridPlugin from "@fullcalendar/daygrid"; // 月表示用プラグイン
import interactionPlugin from "@fullcalendar/interaction"; // クリックやドラッグ操作用プラグイン
import axios from "axios";
import Modal from "../../features/Schedule/Modal";
import DayEventList from "../../features/Schedule/DayEventList";

// メインスケジュールコンポーネント
export default function Schedule() {
  const [events, setEvents] = useState([]);  // 予定一覧
  const [selectedDate, setSelectedDate] = useState(null); // 選択された日付
  const [showModal, setShowModal] = useState(false);  // モーダル表示
  const [form, setForm] = useState({ date: "", time: "", type: "", location: "", note: "" });  // 入力フォーム
  const [editId, setEditId] = useState(null); // 編集対象ID
  const [role, setRole] = useState(""); // ユーザーrole

  useEffect(() => {
    // ログイン中ユーザー情報取得
    axios.get("/api/user").then(res => setRole(res.data.role));

    // スケジュール取得
    axios.get("/api/schedules").then(res => {
      // FullCalendar用の形式に整形
      setEvents(res.data.map(ev => ({ id: ev.id, start: ev.date, extendedProps: { ...ev } })));
    });
  }, []);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value }); // 入力値更新

  // 新規登録処理
  const handleRegister = () => {
    if (!form.date) return alert("日付を指定してください");
    axios.post("/api/schedules", form).then(res => {
      setEvents([...events, { id: res.data.id, start: res.data.date, extendedProps: res.data }]); // stateに追加
      setShowModal(false); // モーダルを閉じる
      setForm({ date: "", time: "", type: "", location: "", note: "" }); // フォーム初期化
    });
  };

  // 更新処理
  const handleUpdate = () => {
    axios.put(`/api/schedules/${editId}`, form).then(res => {
      setEvents(events.map(ev => (ev.id === editId ? { ...ev, extendedProps: res.data, start: res.data.date } : ev)));
      setEditId(null);
      setShowModal(false);
      setForm({ date: "", time: "", type: "", location: "", note: "" }); // フォーム初期化
    });
  };

  // 削除処理
  const handleDelete = id => {
    axios.delete(`/api/schedules/${id}`).then(() => setEvents(events.filter(ev => ev.id !== id))); // stateから除外
  };

  // 編集ボタンを押したとき
  const handleEdit = ev => {
    setForm({ ...ev.extendedProps, date: ev.start }); // フォームに値をセット
    setEditId(ev.id); // 編集対象IDセット
    setShowModal(true); // モーダル表示
  };

  return (
    <div className="max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-800 border-b-4 border-green-500 inline-block pb-2 mb-10">
        スケジュール
      </h1>

      {/* カレンダー */}
      <FullCalendar
        plugins={[dayGridPlugin, interactionPlugin]} // プラグイン指定
        initialView="dayGridMonth" // 月表示
        locale="ja"  // 日本語
        dateClick={arg => setSelectedDate(arg.dateStr)} // 日付クリックでselectedDate更新
        height="auto"
        headerToolbar={{ left: "title", center: "", right: "today prev,next" }} // ヘッダー表示
        titleFormat={{ year: "numeric", month: "long" }} // タイトルフォーマット

        // 土日の背景色変更
        dayCellClassNames={arg => (arg.date.getDay() === 6 ? ["bg-blue-100"] : arg.date.getDay() === 0 ? ["bg-red-100"] : [])}

        // 日付セルの中にイベントがあるかマークを表示
        dayCellContent={arg => {
          const hasEvent = events.some(ev => new Date(ev.start).toDateString() === arg.date.toDateString());
          return (
            <div className="relative w-full h-full flex flex-col items-center justify-center">
              <div className="text-sm font-medium">{arg.dayNumberText}</div>
              {hasEvent && <div className="w-2 h-2 bg-gray-500 rounded-full mt-1" />} {/* イベントありマーク */}
            </div>
          );
        }}
      />

      {/* 選択日ごとの予定一覧 */}
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

      {/* モーダル表示 (新規・編集兼用) */}
      <Modal
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
