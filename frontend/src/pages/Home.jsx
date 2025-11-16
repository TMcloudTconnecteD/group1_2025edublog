import { useState, useEffect } from "react";
import api from "../api/axiosInstance";

export default function Home() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await api.get("/posts");
        setPosts(res.data);
      } catch (err) {
        console.log("Error fetching posts:", err);
      }
    };
    fetchPosts();
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Group1 Blog Posts</h1>
      {posts.map(post => (
        <div key={post._id} className="mb-6 p-4 border rounded shadow">
          <h2 className="text-xl font-bold">{post.title}</h2>
          {post.image && <img src={post.image} className="w-full h-64 object-cover my-2 rounded" />}
          <p>{post.content}</p>
        </div>
      ))}
    </div>
  );
}
