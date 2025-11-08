// ProtectedRoute.jsx
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../Auth/AuthContext";

export default function ProtectedRoute({ allowedRoles }) {
  const { user, loading } = useAuth();

  if (loading) {
    // ユーザー情報を取得中
    return <div className="text-center mt-10">Loading...</div>;
  }

  if (!user) {
    // 未ログインならログインページへ
    return <Navigate to="/" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // 権限なしならトップページへ
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}
