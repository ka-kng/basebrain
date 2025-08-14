import { NavLink } from "react-router-dom";

const menuItems = {
  coach: [
    { label: 'ダッシュボード', path: '/dashboard' },
    { label: '記録', path: '/game/list' },
    { label: 'スケジュール', path: '/schedule' },
    { label: 'マイページ', path: '/mypage' },
  ],
  player: [
    { label: 'ダッシュボード', path: '/dashboard' },
    { label: 'ランキング', path: '/ranking' },
    { label: 'スケジュール', path: '/schedule' },
    { label: 'マイページ', path: '/mypage' },
  ],
};

export default function Sidebar({ role }) {
  return (
    <div className="bg-gray-800">
      <aside
        className="bg-gray-800 text-white
                 w-full md:w-60
                 h-16 md:h-screen
                 fixed bottom-0 md:static
                 flex md:block justify-around items-center
                 z-50"
      >
        <ul className="md:mt-20 flex md:flex-col w-full justify-around md:justify-start md:space-y-2">
          {menuItems[role]?.map(({ label, path }) => (
            <li key={path}>
              <NavLink
                to={path}
                className={({ isActive }) =>
                  `flex flex-col items-center text-sm px-2 py-1 md:px-3 md:py-2 rounded hover:bg-gray-700
                 ${isActive ? 'bg-gray-700 font-bold' : ''}`
                }
              >
                {label}
              </NavLink>
            </li>
          ))}
        </ul>
      </aside>
    </div>
  );
}
