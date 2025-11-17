import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useState, useEffect, useRef } from "react";

export default function Navbar() {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);

  const menuRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

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
              Create New Blog
            </Link>

            {/* Avatar + clickable dropdown */}
            <div className="relative" ref={menuRef}>
              <img
                onClick={() => setOpen(!open)}
                src={
                  user.avatar ||
                  "https://api.dicebear.com/7.x/avataaars/svg?seed=TMcloud"
                }
                alt="profile avatar"
                className="h-9 w-9 rounded-full cursor-pointer border hover:scale-105 transition"
              />

              {/* Dropdown menu */}
              {open && (
                <div className="absolute right-0 mt-2 bg-white shadow-xl rounded-xl w-44 p-3 animate-fadeIn">
                  <p className="px-3 py-2 text-sm text-gray-700 font-medium">
                    Hey, {user.username} 👋
                  </p>

                  <hr className="my-2" />

                  <Link
                    to="/profile"
                    onClick={() => setOpen(false)}
                    className="block px-3 py-2 text-sm hover:bg-gray-100 rounded-lg"
                  >
                    Profile
                  </Link>

                  <Link
                    to="/profile"
                    onClick={() => setOpen(false)}
                    className="block px-3 py-2 text-sm hover:bg-gray-100 rounded-lg"
                  >
                    Your Posts
                  </Link>

                  <button
                    onClick={() => {
                      logout();
                      setOpen(false);
                    }}
                    className="w-full text-left px-3 py-2 text-sm text-red-500 hover:bg-red-100 rounded-lg"
                  >
                    Logout
                  </button>
                </div>
              )}
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
