import axios from 'axios';

// Cookieを送信
axios.defaults.withCredentials = true;

// APIのベースURLを .env から設定
axios.defaults.baseURL = import.meta.env.VITE_API_URL;

// CookieからXSRF-TOKENを読み取ってヘッダーに付与
axios.interceptors.request.use((config) => {
  const token = getCookieValue('XSRF-TOKEN');
  if (token) {
    config.headers['X-XSRF-TOKEN'] = decodeURIComponent(token);
  }
  return config;
});

function getCookieValue(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
}

export default axios;
