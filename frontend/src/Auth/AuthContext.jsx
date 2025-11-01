// src/contexts/AuthContext.jsx
import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // ページ読み込み時にユーザー情報を取得
  useEffect(() => {
    axios.get("/api/user", { withCredentials: true })
      .then(res => setUser(res.data))
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  // login を token と userData 両方に対応
  const login = (accessToken, userData) => {
    localStorage.setItem("access_token", accessToken);
    setUser(userData);
  };

  const logout = async () => {
    await axios.post("/api/logout", {}, { withCredentials: true });
    localStorage.removeItem('access_token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, setUser, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
