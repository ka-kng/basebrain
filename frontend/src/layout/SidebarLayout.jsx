import Sidebar from "../components/Sidebar";
import { Outlet } from "react-router-dom";
import { useAuth } from "../Auth/AuthContext";

export default function SidebarLayout() {
  const { user } = useAuth();
  const role = user?.role || "player";

  return (
    <div className="flex flex-col lg:flex-row min-h-screen">

      {/* PCサイドバー */}
      <div className="hidden lg:block w-56 flex-shrink-0">
        <Sidebar role={role} />
      </div>

      {/* モバイルボトムナビはSidebarコンポーネント内でで制御 */}
      <Sidebar role={role} />

      {/* メインコンテンツ */}
      <main className="pb-24 pt-12 xl:pb-5 px-4 flex-1">
        <Outlet />
      </main>

    </div>
  );
}
