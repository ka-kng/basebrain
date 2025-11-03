import axios from 'axios';

// Cookieを送信
axios.defaults.withCredentials = true;

// APIのベースURLを .env から設定
axios.defaults.baseURL = import.meta.env.VITE_API_URL || 'https://api.kb-sw.com';

// CookieからXSRF-TOKENを読み取ってヘッダーに付与
axios.interceptors.request.use((config) => {
  const token = getCookieValue('XSRF-TOKEN'); // CookieからCSRFトークンを取得
  if (token) {
    config.headers['X-XSRF-TOKEN'] = decodeURIComponent(token); // トークンがあればヘッダーにセット
  }
  return config;
});

function getCookieValue(name) { // 指定した名前のCookie値を取得する関数
  const value = `; ${document.cookie}`; // document.cookieの文字列を取得し先頭に";"を追加
  const parts = value.split(`; ${name}=`); // 指定したCookie名で分割
  if (parts.length === 2) return parts.pop().split(';').shift(); // 値だけ取り出して返す
}

export default axios;
