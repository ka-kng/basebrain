// src/components/Header.jsx
import { Link } from "react-router-dom";

export default function Header() {
  return (
    <header className="fixed top-0 left-0 w-full h-16 bg-gray-900 text-white flex items-center px-4 shadow-md z-50">
      <Link to="/" className="font-bold text-xl text-white md:pl-60">
        Basebrain
      </Link>
    </header>
  );
}
