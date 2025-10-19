import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export default function Header() {
  const navigate = useNavigate();
  const { logout, user } = useAuth(); // userも取得

  const handleLogout = () => {
    logout();      // localStorage と axios ヘッダーをクリア
    navigate("/"); // ログアウト後にホームページにリダイレクト
  };

  return (
    <header className=" top-0 left-0 w-full h-16 bg-gray-900 text-white flex items-center justify-between px-4 shadow-md z-50">
      <p className="font-bold xl:pl-60 text-xl text-white">
        Basebrain
      </p>

      <div className="flex items-center space-x-4">
        {!user ? (
          <>
            <Link to="/login">
              <button className="bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded-lg shadow text-white">
                ログイン
              </button>
            </Link>
            <Link to="/register">
              <button className="bg-green-500 hover:bg-green-600 px-4 py-2 rounded-lg shadow text-white">
                新規登録
              </button>
            </Link>
          </>
        ) : (
          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-lg shadow text-white"
          >
            ログアウト
          </button>
        )}
      </div>
    </header>
  );
}
