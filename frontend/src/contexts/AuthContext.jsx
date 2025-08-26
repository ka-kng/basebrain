import { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      const getUser = async () => {
        try {
          const res = await axios.get('api/user');
          setUser(res.data);
        } catch (err) {
          console.error(err);
          logout();
        }
      };
      getUser();
    }
  }, []);

  const login = (token) => {
    localStorage.setItem('access_token', token);
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    const getUser = async () => {
      try {
        const res = await axios.get('api/user');
        setUser(res.data);
      } catch (err) {
        console.error(err);
        logout();
      }
    };
    getUser();
  };

  const logout = () => {
    localStorage.removeItem('access_token');
    delete axios.defaults.headers.common['Authorization'];
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
