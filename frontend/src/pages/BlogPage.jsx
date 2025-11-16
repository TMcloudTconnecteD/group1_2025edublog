import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api/axiosInstance";
import { useAuth } from "../context/AuthContext";

export default function BlogPage() {
  const { id } = useParams();
  const { user } = useAuth();

  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState("");
  const [loading, setLoading] = useState(true);
  const [darkMode, setDarkMode] = useState(localStorage.getItem("darkMode") === "true");

  // Toggle dark mode
  const toggleDarkMode = () => {
    localStorage.setItem("darkMode", !darkMode);
    setDarkMode(!darkMode);
  };

  // Fetch single post
  const fetchPost = async () => {
    try {
      const res = await api.get(`/posts/${id}`);
      setPost(res.data);
    } catch (err) {
      console.log("Fetch post error:", err);
    }
  };

  // Fetch comments
  const fetchComments = async () => {
    try {
      const res = await api.get(`/posts/${id}/comments`);
      setComments(res.data);
    } catch (err) {
      console.log("Fetch comments error:", err);
    }
  };

  // Handle like/unlike (❤️ only)
  const handleLike = async () => {
    if (!user) return alert("You must be logged in to like a post!");
    try {
      const res = await api.post(`/posts/${id}/like`);
      // Immediately update the local state to reflect the like
      setPost((prev) => ({
        ...prev,
        likes: res.data.likes,
      }));
    } catch (err) {
      console.log("Error liking post:", err);
    }
  };

  // Submit comment
  const submitComment = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    try {
      await api.post(`/posts/${id}/comments`, { text: commentText });
      setCommentText("");
      fetchComments();
    } catch (err) {
      console.log("Error posting comment:", err);
    }
  };

  useEffect(() => {
    (async () => {
      await fetchPost();
      await fetchComments();
      setLoading(false);
    })();
  }, [id]);

  if (loading) return <p className="text-center mt-10">Loading...</p>;
  if (!post) return <p className="text-center mt-10">Post not found</p>;

  return (
    <div className={`max-w-3xl mx-auto p-4 mt-8 transition-colors ${darkMode ? "bg-gray-900 text-white" : "bg-white text-gray-900"}`}>
      
      {/* Dark mode toggle */}
      <div className="flex justify-end mb-4">
        <button
          onClick={toggleDarkMode}
          className="px-3 py-1 rounded bg-gray-300 dark:bg-gray-700 dark:text-white"
        >
          {darkMode ? "Light Mode" : "Dark Mode"}
        </button>
      </div>

      {post.image && (
        <img
          src={post.image}
          className="w-full h-72 object-cover rounded"
          alt={post.title}
        />
      )}

      <h1 className="text-3xl font-bold mt-4">{post.title}</h1>
      <p className="text-gray-500 dark:text-gray-400 mt-1">
        By {post?.author?.username || "Unknown"}
      </p>

      <p className="mt-4 text-lg">{post.content}</p>

      {/* Like button */}
      <div className="mt-4 flex items-center gap-4">
        <button
          onClick={handleLike}
          className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
        >
          ❤️ Like ({post.likes?.length || 0})
        </button>

        {post.likes?.length > 0 && (
          <p className="text-gray-600 dark:text-gray-300 text-sm">
            Liked by: {post.likes.map((user) => user.username).join(", ")}
          </p>
        )}
      </div>

      <h2 className="text-2xl font-semibold mt-8">Comments</h2>

      <form className="flex gap-2 mt-4" onSubmit={submitComment}>
        <input
          className={`flex-1 border p-2 rounded ${darkMode ? "bg-gray-800 text-white border-gray-700" : ""}`}
          placeholder="Write a comment..."
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
        />
        <button className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700">Post</button>
      </form>

      <div className="mt-4">
        {comments.map((c) => (
          <div
            key={c._id}
            className={`border p-3 rounded mb-2 ${darkMode ? "border-gray-700" : ""}`}
          >
            <p className="font-semibold">{c.user?.username || "Unknown"}</p>
            <p>{c.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
