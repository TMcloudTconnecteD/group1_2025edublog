import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav className="flex items-center justify-between px-6 py-4 bg-white shadow-md sticky top-0 z-50">
      <Link
        to="/"
        className="text-2xl font-bold text-indigo-600 hover:text-indigo-500 transition"
      >
        EduBlog
      </Link>

      <div className="flex items-center gap-6">
        {user && (
          <>
            <Link
              to="/create"
              className="hover:text-indigo-600 font-medium transition"
            >
              Create
            </Link>

            {/* Avatar + dropdown */}
            <div className="relative group">
              <img
                src={
                  user.avatar ||
                  "https://api.dicebear.com/7.x/avataaars/svg?seed=TMcloud"
                }
                alt="profile avatar"
                className="h-8 w-8 rounded-full cursor-pointer"
              />

              {/* Dropdown */}
              <div className="absolute right-0 mt-2 bg-white shadow-lg rounded-lg w-40 p-2 hidden group-hover:block">
                <Link
                  to="/profile"
                  className="block px-3 py-2 text-sm hover:bg-gray-100 rounded"
                >
                  Profile
                </Link>

                <Link
                  to="/profile/posts"
                  className="block px-3 py-2 text-sm hover:bg-gray-100 rounded"
                >
                  Your Posts
                </Link>

                <button
                  onClick={logout}
                  className="w-full text-left px-3 py-2 text-sm text-red-500 hover:bg-red-100 rounded"
                >
                  Logout
                </button>
              </div>
            </div>
          </>
        )}

        {!user && (
          <>
            <Link
              to="/login"
              className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-500 transition"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-500 transition"
            >
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}
