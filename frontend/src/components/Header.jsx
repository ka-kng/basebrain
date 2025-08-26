import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export default function Header() {
  const navigate = useNavigate();
  const { logout } = useAuth(); // AuthContext から logout を取得

  const handleLogout = () => {
    logout();      // localStorage と axios ヘッダーをクリア
    navigate("/login");
  };

  return (
    <header className="fixed top-0 left-0 w-full h-16 bg-gray-900 text-white flex items-center justify-between px-4 shadow-md z-50">
      <Link to="/" className="font-bold text-xl text-white">
        Basebrain
      </Link>

      <button
        onClick={handleLogout}
        className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-lg shadow text-white"
      >
        ログアウト
      </button>
    </header>
  );
}
