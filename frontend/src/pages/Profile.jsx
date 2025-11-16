import { useEffect, useState, useContext } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../api/axiosInstance";
import { useNavigate, Link } from "react-router-dom";

export default function Profile() {
  const { user, setUser } = useAuth();
  const [posts, setPosts] = useState([]);
  const navigate = useNavigate();

  if (!user) {
    navigate("/login");
  }

  const fetchPosts = async () => {
    try {
      const res = await api.get("/posts/user"); // backend should filter by logged-in user
      setPosts(res.data.sort((a, b) => (b.upvotes || 0) - (a.upvotes || 0)));
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const deletePost = async (id) => {
    if (!confirm("Are you sure you want to delete this post?")) return;
    try {
      await api.delete(`/posts/${id}`);
      setPosts(posts.filter(p => p._id !== id));
    } catch (err) {
      alert("Failed to delete post");
    }
  };

  return (
    <div className="max-w-4xl mx-auto mt-8 p-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Your Profile</h2>
        <button
          onClick={() => {
            localStorage.removeItem("user");
            setUser(null);
            navigate("/login");
          }}
          className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
        >
          Logout
        </button>
      </div>

      <div className="mb-6">
        <h3 className="text-xl font-semibold">Your Posts</h3>
        {posts.length === 0 && <p className="text-gray-500">You haven't created any posts yet.</p>}
        <div className="grid gap-4 mt-4">
          {posts.map(p => (
            <div key={p._id} className="border rounded p-4 hover:shadow-lg transition-shadow">
              <Link to={`/posts/${p._id}`}>
                {p.image && <img src={p.image} className="w-full h-48 object-cover rounded mb-2" />}
                <h4 className="font-bold text-lg">{p.title}</h4>
              </Link>
              <div className="flex justify-between items-center mt-2">
                <span className="text-sm text-gray-500">👍 {p.upvotes || 0} | 👎 {p.downvotes || 0}</span>
                <div className="flex gap-2">
                  <Link
                    to={`/edit/${p._id}`}
                    className="text-blue-500 hover:underline text-sm"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => deletePost(p._id)}
                    className="text-red-500 hover:underline text-sm"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
