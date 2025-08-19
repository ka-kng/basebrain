import { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import ProtectedRoute from './components/ProtectedRoute';
import RegisterForm from './Auth/RegisterForm';
import LoginForm from './Auth/LoginForm';
import { useAuth } from './contexts/AuthContext';
import SidebarLayout from './layout/SidebarLayout';
import GameRecordForm from './Records/GameRecordForm';
import BattingRecordForm from './Records/BattingRecordForm';
import PitchingRecordForm from './Records/PitchingRecordForm';
import ManagerDashboard from './pages/ManagerDashboard';
import SummaryRecord from './Records/SummaryRecord';
import GameList from './pages/GameList';
import GameDetail from './pages/GameDetail';
import PlayerDashboard from './pages/PlayerDashboard';
import PlayerRanking from './pages/PlayerRanking';
import Schedule from './pages/Schedule';

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
        <Route
          path="/dashboard/manager"
          element={
            <ProtectedRoute user={user} allowedRoles={['coach']}>
              <ManagerDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/player"
          element={
            <ProtectedRoute user={user} allowedRoles={['player']}>
              <PlayerDashboard />
            </ProtectedRoute>
          }
        />
        <Route path="records/game" element={<GameRecordForm />} />
        <Route path="records/game/:id/edit" element={<GameRecordForm />} />
        <Route path="records/batting" element={<BattingRecordForm />} />
        <Route path="records/batting/:id/edit" element={<BattingRecordForm />} />
        <Route path="records/pitching" element={<PitchingRecordForm />} />
        <Route path="records/pitching/:id/edit" element={<PitchingRecordForm />} />
        <Route path="records/summary" element={<SummaryRecord />} />

        <Route path="games/list" element={<GameList />} />
        <Route path="games/:id" element={<GameDetail />} />

        <Route path="ranking" element={<PlayerRanking />} />
        <Route path="schedule" element={<Schedule />} />
        {/* <Route path="mypage" element={<Mypage />} /> */}
      </Route>
    </Routes>
  );
}

export default App;
