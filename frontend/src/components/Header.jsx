import { Link } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export default function Header() {
  const { user, setUser } = useContext(AuthContext);

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
  };

  return (
    <nav className="w-full flex justify-between items-center p-4 bg-primary text-white shadow-md">
      <Link to="/" className="font-bold text-2xl">G1EduBlog</Link>
      <div className="flex items-center gap-4">
        <Link to="/" className="hover:underline">Home</Link>
        <Link to="/create" className="hover:underline">Create</Link>
        {!user ? (
          <>
            <Link to="/login" className="hover:underline">Login</Link>
            <Link to="/register" className="hover:underline">Register</Link>
          </>
        ) : (
          <>
            <span>Hey, {user.username}</span>
            <button
              onClick={logout}
              className="bg-accent px-3 py-1 rounded text-black font-semibold hover:bg-yellow-400"
            >
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  );
}
