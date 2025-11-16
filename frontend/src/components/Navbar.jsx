// frontend/src/components/Navbar.jsx
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/"); // redirect after logout
  };

  return (
    <nav className="flex items-center justify-between px-6 py-4 bg-white shadow-md sticky top-0 z-50">
      {/* Logo */}
      <Link to="/" className="text-2xl font-bold text-indigo-600 hover:text-indigo-500 transition">
        EduBlog
      </Link>

      {/* Links */}
      <div className="flex items-center gap-4">
        {/* <Link to="/" className="hover:text-indigo-600 font-medium transition">Home</Link> */}
        {user && <Link to="/create" className="hover:text-indigo-600 font-medium transition">Create</Link>}

        {/* Auth buttons / user info */}
        {!user ? (
          <>
            <Link to="/login" className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-500 transition">
              Login
            </Link>
            <Link to="/register" className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-500 transition">
              Register
            </Link>
          </>
        ) : (
          <div className="flex items-center gap-3">
            <span className="font-medium text-gray-700">Hey, {user.username}</span>
            <button
              onClick={handleLogout}
              className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-400 transition"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}
