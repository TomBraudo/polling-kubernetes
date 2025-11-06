// Header component: shared navigation header

import { Link, useLocation } from "react-router-dom";
import { useUser } from "../../context/UserContext";

export default function Header() {
  const { user, logout } = useUser();
  const location = useLocation();

  if (!user) return null;

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6">
            <h1 className="text-2xl font-bold text-gray-900">Polling App</h1>
            <nav className="flex gap-4">
              <Link
                to="/dashboard"
                className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                  location.pathname === "/dashboard"
                    ? "bg-indigo-100 text-indigo-700"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                Dashboard
              </Link>
              <Link
                to="/profile"
                className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                  location.pathname === "/profile"
                    ? "bg-indigo-100 text-indigo-700"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                My Polls
              </Link>
            </nav>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">Welcome, {user.username}</span>
            <button
              onClick={logout}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}

