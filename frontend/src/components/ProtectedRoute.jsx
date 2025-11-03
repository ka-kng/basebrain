// ProtectedRoute.jsx
import { Navigate } from "react-router-dom";
import { useAuth } from "../Auth/AuthContext";

export default function ProtectedRoute({ allowedRoles, children }) {
  const { user, loading } = useAuth();

  if (loading) {
    // ユーザー情報を取得中は画面を動かさない
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

  return children;
}
