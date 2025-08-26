import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function Header() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    const token = localStorage.getItem("token");

    try {
      await axios.post(
        "/api/logout",
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
    } catch (error) {
      console.warn("サーバー側ログアウト失敗、フロントで削除します");
    } finally {
      // トークン削除
      localStorage.removeItem("token");
      // ログインページへ
      navigate("/login");
    }
  };

  return (
    <header className="fixed top-0 left-0 w-full h-16 bg-gray-900 text-white flex items-center justify-between px-4 shadow-md z-50">
      <h1 className="font-bold text-xl">Basebrain</h1>

      <button
        onClick={handleLogout}
        className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-lg shadow text-white"
      >
        ログアウト
      </button>
    </header>
  );
}
