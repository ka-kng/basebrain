// ProtectedRoute.jsx
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ user, allowedRoles, children }) {
  if (!user) {
    // 未ログインならログインページへ
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(user.role)) {
    // 権限なしならダッシュボードなどへ
    return <Navigate to={"/"} replace />;
  }

  return children;
}
