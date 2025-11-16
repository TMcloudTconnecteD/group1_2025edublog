import { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import api from "../api/axiosInstance";
import { useAuth } from "../context/AuthContext";

export default function PostDetails() {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [comment, setComment] = useState("");
  const { user } = useAuth();

  const fetchPost = async () => {
    try {
      const res = await api.get(`/posts/${id}`);
      setPost(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchPost();
  }, [id]);

  const handleVote = async (type) => {
    try {
      await api.post(`/posts/${id}/vote`, { type });
      fetchPost();
    } catch {
      alert("You need to login to vote!");
    }
  };

  const handleComment = async () => {
    if (!comment) return;
    try {
      await api.post(`/posts/${id}/comment`, { text: comment });
      setComment("");
      fetchPost();
    } catch {
      alert("You need to login to comment!");
    }
  };

  if (!post) return <p className="text-center mt-10">Loading...</p>;

  return (
    <div className="max-w-3xl mx-auto p-4">
      {post.image && <img src={post.image} className="w-full h-96 object-cover rounded mb-4" />}
      <h1 className="text-3xl font-bold mb-2">{post.title}</h1>
      <p className="text-gray-700 mb-4">{post.content}</p>
      <div className="flex gap-2 mb-4">
        <button
          onClick={() => handleVote("up")}
          className="bg-green-400 text-white px-3 py-1 rounded hover:bg-green-500"
        >
          👍 {post.upvotes || 0}
        </button>
        <button
          onClick={() => handleVote("down")}
          className="bg-red-400 text-white px-3 py-1 rounded hover:bg-red-500"
        >
          👎 {post.downvotes || 0}
        </button>
      </div>

      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Comments ({post.comments?.length || 0})</h2>
        {post.comments?.map((c) => (
          <div key={c._id} className="border-b py-2">
            <span className="font-semibold">{c.user?.username || "Anonymous"}</span>: {c.text}
          </div>
        ))}
      </div>

      {user ? (
        <div className="flex flex-col gap-2">
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows={3}
            placeholder="Add a comment..."
            className="border p-2 rounded"
          />
          <button
            onClick={handleComment}
            className="bg-primary text-white px-4 py-2 rounded hover:bg-red-500"
          >
            Submit Comment
          </button>
        </div>
      ) : (
        <p className="text-gray-500">Login to comment.</p>
      )}
    </div>
  );
}
