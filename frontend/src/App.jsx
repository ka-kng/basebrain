import { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import RegisterForm from './Auth/RegisterForm';
import LoginForm from './Auth/LoginForm';
import { useAuth } from './contexts/AuthContext';
import SidebarLayout from './layout/SidebarLayout';
import Records from './Records/GameRecordForm';
import Dashboard from './pages/Dashboard';


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
        <Route path="records" element={<Records />} />
        {/* <Route path="ranking" element={<Ranking />} /> */}
        {/* <Route path="schedule" element={<Schedule />} /> */}
        {/* <Route path="mypage" element={<Mypage />} /> */}
      </Route>
    </Routes>
  );
}

export default App;
