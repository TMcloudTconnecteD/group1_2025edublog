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

  // Handle like/unlike
  const handleLike = async () => {
    if (!user) return alert("You must be logged in to like a post!");
    try {
      const res = await api.post(`/posts/${id}/like`);
      setPost((prev) => ({ ...prev, likes: res.data.likes }));
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
    <div className="max-w-3xl mx-auto p-4 mt-8">
      {post.image && (
        <img src={post.image} className="w-full h-72 object-cover rounded" alt={post.title} />
      )}

      <h1 className="text-3xl font-bold mt-4">{post.title}</h1>
      <p className="text-gray-500 mt-1">
        By {post?.author?.username || "Unknown"}
      </p>

      <p className="mt-4 text-lg">{post.content}</p>

      <div className="mt-4 flex items-center gap-4">
        <button
          onClick={handleLike}
          className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
        >
          ❤️ Like ({post.likes?.length || 0})
        </button>

        {post.likes?.length > 0 && (
          <p className="text-gray-600 text-sm">
            Liked by:{" "}
            {post.likes.map((user) => user.username).join(", ")}
          </p>
        )}
      </div>

      <h2 className="text-2xl font-semibold mt-8">Comments</h2>

      <form className="flex gap-2 mt-4" onSubmit={submitComment}>
        <input
          className="flex-1 border p-2 rounded"
          placeholder="Write a comment..."
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
        />
        <button className="bg-primary text-black px-4 py-2 rounded">Post</button>
      </form>

      <div className="mt-4">
        {comments.map((c) => (
          <div key={c._id} className="border p-3 rounded mb-2">
            <p className="font-semibold">{c.user?.username || "Unknown"}</p>
            <p>{c.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
