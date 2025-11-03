import { NavLink } from "react-router-dom";
import { Home, Trophy, Calendar, BookOpen, User } from "lucide-react";

const icons = {
  "ダッシュボード": <Home size={20} />,
  "ランキング": <Trophy size={20} />,
  "記録": <BookOpen size={20} />,
  "スケジュール": <Calendar size={20} />,
  "マイページ": <User size={20} />,
};

const menuItems = {
  coach: [
    { label: 'ダッシュボード', path: '/dashboard/manager' },
    { label: 'ランキング', path: '/ranking' },
    { label: '記録', path: '/games/list' },
    { label: 'スケジュール', path: '/schedule' },
    { label: 'マイページ', path: '/mypage' },
  ],
  player: [
    { label: 'ダッシュボード', path: '/dashboard/player' },
    { label: 'ランキング', path: '/ranking' },
    { label: 'スケジュール', path: '/schedule' },
    { label: 'マイページ', path: '/mypage' },
  ],
};

export default function Sidebar({ role }) {
  const items = menuItems[role] ?? [];

  return (
    <>
      {/* PC Sidebar */}
      <aside
        className="hidden lg:flex lg:flex-col fixed top-0 left-0 w-56 h-screen
                   bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900
                   text-gray-300 shadow-2xl border-r border-gray-700 z-50 overflow-y-auto"
      >
        <ul className="mt-24 space-y-4 px-4">
          {items.map(({ label, path }) => (
            <li key={path}>
              <NavLink
                to={path}
                className={({ isActive }) =>
                  `flex items-center space-x-3 px-4 py-3 rounded-lg
                   transition-all duration-300 transform
                   hover:translate-x-2 hover:bg-gradient-to-r hover:from-purple-500 hover:to-pink-500 hover:text-white hover:shadow-lg
                   ${isActive ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold shadow-2xl scale-105' : ''}`
                }
              >
                {icons[label]}
                <span className="whitespace-nowrap">{label}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </aside>

      {/* Mobile */}
      <aside
        className="flex lg:hidden fixed bottom-0 left-0 w-full h-16
                   bg-gray-900 flex justify-around items-center
                   text-gray-300 shadow-2xl z-50"
      >
        {items.map(({ label, path }) => (
          <NavLink
            key={path}
            to={path}
            className={({ isActive }) =>
              `flex flex-col items-center text-xs transition-all duration-300
               transform hover:-translate-y-1 hover:text-pink-400
               ${isActive ? 'text-purple-400 font-bold scale-110' : ''}`
            }
          >
            {icons[label]}
            <span>{label}</span>
          </NavLink>
        ))}
      </aside>
    </>
  );
}
