import React from 'react';
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom';
import './index.css'
import './App.css'
import App from './App.jsx'
import { AuthProvider } from './Auth/AuthContext.jsx';
import './lib/axios.js'

createRoot(document.getElementById('root')).render(

  // 開発用安全チェック
  <React.StrictMode>

    {/* React Router のルーター */}
    {/* ブラウザの URL に応じてルートを切り替える */}
    <BrowserRouter>

      {/* 認証情報を管理する Context Provider */}
      {/* この中のコンポーネントで useAuth() が使える */}
      <AuthProvider>

        {/* アプリのメインコンポーネント */}
        {/* ルーティングやページの描画を管理 */}
        <App />

      </AuthProvider>

    </BrowserRouter>

  </React.StrictMode>
)
