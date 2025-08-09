import Sidebar from "../components/Sidebar";
import { Outlet } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export default function SidebarLayout() {
  const { user } = useAuth();

  console.log('SidebarLayout user:', user);

  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      <Sidebar role={user?.role || 'player'} />

      <main className="flex-1 p-4 bg-gray-50">
        <Outlet />
      </main>
    </div >
  );
}
