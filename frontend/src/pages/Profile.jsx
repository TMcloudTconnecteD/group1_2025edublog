import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../api/axiosInstance";
import { Link, useNavigate } from "react-router-dom";

export default function Profile() {
  const { user, logout } = useAuth();
  const [posts, setPosts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) return navigate("/login");
    fetchUserPosts();
  }, [user]);

  const fetchUserPosts = async () => {
    try {
      const res = await api.get("/posts/user");
      setPosts(res.data);
    } catch (err) {
      console.error("Error fetching posts:", err.response?.data || err.message);
    }
  };

  const deletePost = async (id) => {
    if (!confirm("Delete this post?")) return;
    try {
      await api.delete(`/posts/${id}`);
      setPosts(posts.filter((p) => p._id !== id));
    } catch (err) {
      alert("Could not delete post.");
    }
  };

  return (
    <div className="max-w-4xl mx-auto mt-10 p-4">
      <h1 className="text-3xl font-bold mb-4">Hey, {user.username}!</h1>
      <h2 className="text-2xl font-semibold mb-6">Your Posts</h2>

      {posts.length === 0 ? (
        <p className="text-gray-500">You haven't posted anything yet.</p>
      ) : (
        <div className="grid gap-6">
          {posts.map((p) => (
            <div key={p._id} className="border rounded p-4 hover:shadow">
              <Link to={`/post/${p._id}`}>
                <h3 className="font-bold text-xl">{p.title}</h3>
              </Link>
              {p.image && (
                <img
                  src={p.image}
                  alt={p.title}
                  className="w-full h-52 object-cover mt-3 rounded"
                />
              )}
              <div className="flex justify-between mt-3">
                <Link to={`/edit/${p._id}`} className="text-blue-600">
                  Edit
                </Link>
                <button
                  onClick={() => deletePost(p._id)}
                  className="text-red-600"
                >
                  Delete
                </button>
              </div>
              <p className="text-gray-500 mt-2">
                {p.likes?.length || 0} Likes • {p.commentsCount || 0} Comments
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
