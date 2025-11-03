import { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

const AuthContext = createContext(); // 認証情報を共有するためのコンテキスト

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // 現在ログインしているユーザー情報を管理
  const [loading, setLoading] = useState(true);  // ユーザー情報取得中かどうかの状態を管理

  // 初回読み込み時に token チェック
  useEffect(() => {
    const token = sessionStorage.getItem('access_token'); // sessionStorage からトークンを取得
    if (token) { // トークンが存在する場合
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`; // axios に自動で Authorization ヘッダを設定
      axios.get('/api/user') // サーバーからユーザー情報を取得
        .then(res => setUser(res.data)) // 成功したら user に保存
        .catch(() => logout()) // 失敗したらログアウト処理
        .finally(() => setLoading(false)); // 処理が終わったら loading を false に
    } else {
      setLoading(false); // 読み込み完了
    }
  }, []);

  // ログイン処理
  const login = (token, userData = null) => {
    sessionStorage.setItem('access_token', token); // sessionStorage に保存
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`; // axios にヘッダを設定

    if (userData) { // ユーザー情報が渡された場合
      setUser(userData);  // user に保存
    } else {
      axios.get('/api/user') // サーバーからユーザー情報を取得
        .then(res => setUser(res.data)) // 成功したら保存
        .catch(err => { // 失敗したらログアウト
          console.error(err); // エラーをコンソール表示
          logout(); // ログアウト処理
        });
    }
  };

  // ログアウト処理
  const logout = () => {
    sessionStorage.removeItem('access_token'); // sessionStorage からトークンを削除
    delete axios.defaults.headers.common['Authorization']; // axios のヘッダも削除
    setUser(null); // user を null に
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
