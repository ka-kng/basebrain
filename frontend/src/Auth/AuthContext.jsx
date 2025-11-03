import { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

const AuthContext = createContext(); // 認証情報を共有するためのコンテキストを作成

// この中に入れた情報を子コンポーネントに渡す
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // この中の処理はコンポーネント初回表示時に実行される
  useEffect(() => {
    const token = localStorage.getItem('access_token'); // ローカルストレージに保存しているトークンを取り出す
    if (token) { // トークンがあれば「ログイン済み」と判断

      // axiosのリクエストに自動でトークンをつける
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

      // サーバーからユーザー情報を取得
      axios.get('/api/user')
        .then(res => setUser(res.data)) // 成功したらuserに入れる
        .catch(() => logout()) // 失敗したらログアウト
        .finally(() => setLoading(false)); // 終わったら読み込み完了
    } else {
      setLoading(false); // トークンがなければ読み込み完了
    }
  }, []);

  // ログイン処理用関数。トークンとユーザー情報をセット
  const login = (token, userData = null) => {
    localStorage.setItem('access_token', token); // トークンをブラウザに保存
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`; // axiosに自動で認証情報をつける

    if (userData) {
      setUser(userData); // ユーザー情報があればstateに保存
    } else {
      axios.get('/api/user') // ユーザー情報がなければサーバーから取得
        .then(res => setUser(res.data)) // 成功したら保存
        .catch(err => {  // 失敗したらログアウト
          console.error(err);
          logout();
        });
    }
  };


  const logout = () => {
    localStorage.removeItem('access_token'); // トークンをブラウザから消す
    delete axios.defaults.headers.common['Authorization'];  // axiosの認証情報も削除
    setUser(null); 
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
