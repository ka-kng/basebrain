import { Routes, Route } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

import RegisterForm from './Auth/RegisterForm';
import LoginForm from './Auth/LoginForm';
import ForgetPassword from './Auth/ForgetPassword';
import ResetPassword from './Auth/ResetPassword';

import SidebarLayout from './layout/SidebarLayout';
import ManagerDashboard from './pages/ManagerDashboard';
import PlayerDashboard from './pages/PlayerDashboard';

import GameRecordForm from './Records/GameRecordForm';
import BattingRecordForm from './Records/BattingRecordForm';
import PitchingRecordForm from './Records/PitchingRecordForm';
import SummaryRecord from './Records/SummaryRecord';

import GameList from './pages/GameList';
import GameDetail from './pages/GameDetail';
import PlayerRanking from './pages/PlayerRanking';
import Schedule from './pages/Schedule';
import Mypage from './pages/Mypage';

function App() {
  const { user, loading } = useAuth();

  if (loading) return <p>読み込み中...</p>;

  return (
    <Routes>
      {/* 非ログインページ */}
      <Route path="/register" element={<RegisterForm />} />
      <Route path="/login" element={<LoginForm />} />
      <Route path="password/forget" element={<ForgetPassword />} />
      <Route path="password/reset" element={<ResetPassword />} />

      {/* ログイン後のレイアウト */}
      <Route path="/" element={<SidebarLayout />}>

        {/* コーチ専用 */}
        <Route
          path="dashboard/manager"
          element={
            <ProtectedRoute user={user} allowedRoles={['coach']}>
              <ManagerDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="records/game"
          element={
            <ProtectedRoute user={user} allowedRoles={['coach']}>
              <GameRecordForm />
            </ProtectedRoute>
          }
        />
        <Route
          path="records/game/:id/edit"
          element={
            <ProtectedRoute user={user} allowedRoles={['coach']}>
              <GameRecordForm />
            </ProtectedRoute>
          }
        />
        <Route
          path="records/batting"
          element={
            <ProtectedRoute user={user} allowedRoles={['coach']}>
              <BattingRecordForm />
            </ProtectedRoute>
          }
        />
        <Route
          path="records/batting/:id/edit"
          element={
            <ProtectedRoute user={user} allowedRoles={['coach']}>
              <BattingRecordForm />
            </ProtectedRoute>
          }
        />
        <Route
          path="records/pitching"
          element={
            <ProtectedRoute user={user} allowedRoles={['coach']}>
              <PitchingRecordForm />
            </ProtectedRoute>
          }
        />
        <Route
          path="records/pitching/:id/edit"
          element={
            <ProtectedRoute user={user} allowedRoles={['coach']}>
              <PitchingRecordForm />
            </ProtectedRoute>
          }
        />
        <Route
          path="records/summary"
          element={
            <ProtectedRoute user={user} allowedRoles={['coach']}>
              <SummaryRecord />
            </ProtectedRoute>
          }
        />

        {/* プレイヤー専用 */}
        <Route
          path="dashboard/player"
          element={
            <ProtectedRoute user={user} allowedRoles={['player']}>
              <PlayerDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="ranking"
          element={
            <ProtectedRoute user={user} allowedRoles={['player', 'coach']}>
              <PlayerRanking />
            </ProtectedRoute>
          }
        />
        <Route
          path="schedule"
          element={
            <ProtectedRoute user={user} allowedRoles={['player', 'coach']}>
              <Schedule />
            </ProtectedRoute>
          }
        />
        <Route
          path="mypage"
          element={
            <ProtectedRoute user={user} allowedRoles={['player', 'coach']}>
              <Mypage />
            </ProtectedRoute>
          }
        />

        {/* 共通ページ */}
        <Route
          path="games/list"
          element={
            <ProtectedRoute user={user} allowedRoles={['player','coach']}>
              <GameList />
            </ProtectedRoute>
          }
        />
        <Route
          path="games/:id"
          element={
            <ProtectedRoute user={user} allowedRoles={['player','coach']}>
              <GameDetail />
            </ProtectedRoute>
          }
        />
      </Route>
    </Routes>
  );
}

export default App;
