import { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import RegisterForm from './Auth/RegisterForm';
import LoginForm from './Auth/LoginForm';
import { useAuth } from './contexts/AuthContext';
import SidebarLayout from './layout/SidebarLayout';
import GameRecordForm from './Records/GameRecordForm';
import BattingRecordForm from './Records/BattingRecordForm';
import PitchingRecordForm from './Records/PitchingRecordForm';
import Dashboard from './pages/Dashboard';
import SummaryRecord from './Records/SummaryRecord';
import GameList from './pages/GameList';

function App() {
  const { user, loading } = useAuth();

  if (loading) return <p>読み込み中...</p>

  return (
    <Routes>
      {/* 非ログイン時 */}
      <Route path="/register" element={<RegisterForm />} />
      <Route path="/login" element={<LoginForm />} />

      {/* ログイン後 (Sidebar含めたレイアウト) */}
      <Route path="/" element={<SidebarLayout />}>
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="/records/game" element={<GameRecordForm  />} />
        <Route path="/records/batting" element={<BattingRecordForm />} />
        <Route path="/records/pitching" element={<PitchingRecordForm />} />
        <Route path="/records/summary" element={<SummaryRecord />} />
        <Route path="/game/list" element={<GameList />} />
        {/* <Route path="ranking" element={<Ranking />} /> */}
        {/* <Route path="schedule" element={<Schedule />} /> */}
        {/* <Route path="mypage" element={<Mypage />} /> */}
      </Route>
    </Routes>
  );
}

export default App;
