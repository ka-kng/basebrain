import { Routes, Route } from 'react-router-dom';
import { useAuth } from './Auth/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

import RegisterForm from './Auth/RegisterForm';
import LoginForm from './Auth/LoginForm';
import ForgetPassword from './Auth/ForgetPassword';
import ResetPassword from './Auth/ResetPassword';

import SidebarLayout from './layout/SidebarLayout';
import ManagerDashboard from './pages/Dashboard/ManagerDashboard';
import PlayerDashboard from './pages/Dashboard/PlayerDashboard';

import GameRecordForm from './pages/Records/GameRecordForm';
import BattingRecordForm from './pages/Records/BattingRecordForm';
import PitchingRecordForm from './pages/Records/PitchingRecordForm';
import SummaryRecord from './pages/Records/SummaryRecord';

import GameList from './pages/Game/GameList';
import GameDetail from './pages/Game/GameDetail';
import PlayerRanking from './pages/Ranking/PlayerRanking';
import Schedule from './pages/Schedule/Schedule';
import Mypage from './pages/Mypage/Mypage';
import Home from './pages/Home/Home';
import Header from './components/Header';

function App() {
  const { user, loading } = useAuth();

  if (loading) return <p>読み込み中...</p>;

  return (
    <>
      <Header />
      <Routes>
        {/* 非ログインページ */}
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<RegisterForm />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="password/forget" element={<ForgetPassword />} />
        <Route path="password/reset" element={<ResetPassword />} />

        {/* ログイン後の共通レイアウト */}
        <Route path="/" element={<SidebarLayout />}>

          {/* コーチ専用ルートまとめ */}
          <Route element={<ProtectedRoute user={user} allowedRoles={['coach']} />}>
            <Route path="dashboard/manager" element={<ManagerDashboard />} />

            {/* 試合・成績管理 */}
            <Route path="records/game" element={<GameRecordForm />} />
            <Route path="records/game/:id/edit" element={<GameRecordForm />} />
            <Route path="records/batting" element={<BattingRecordForm />} />
            <Route path="records/batting/:id/edit" element={<BattingRecordForm />} />
            <Route path="records/pitching" element={<PitchingRecordForm />} />
            <Route path="records/pitching/:id/edit" element={<PitchingRecordForm />} />
            <Route path="records/summary" element={<SummaryRecord />} />
          </Route>

          {/* プレイヤー専用ルートまとめ */}
          <Route element={<ProtectedRoute user={user} allowedRoles={['player']} />}>
            <Route path="dashboard/player" element={<PlayerDashboard />} />
          </Route>

          {/* コーチ・プレイヤー共通 */}
          <Route element={<ProtectedRoute user={user} allowedRoles={['coach', 'player']} />}>
            <Route path="ranking" element={<PlayerRanking />} />
            <Route path="schedule" element={<Schedule />} />
            <Route path="mypage" element={<Mypage />} />
            <Route path="games/list" element={<GameList />} />
            <Route path="games/:id" element={<GameDetail />} />
          </Route>

        </Route>
      </Routes>
    </>
  );
}

export default App;
