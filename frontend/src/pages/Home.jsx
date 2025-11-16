import { useEffect, useState } from "react";
import axios from "axios";
import PostCard from "../components/PostCard";
import Footer from "../components/Footer";

export default function Home() {
  const [posts, setPosts] = useState([]);
  const [displayed, setDisplayed] = useState(4); // pagination amount
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("mostLiked");

  const fetchPosts = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/posts`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      let sorted = [...res.data];

      // Sorting options
      if (filter === "mostLiked") {
        sorted.sort((a, b) => (b.likes?.length || 0) - (a.likes?.length || 0));
      } else if (filter === "newest") {
        sorted.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      } else if (filter === "mostCommented") {
        sorted.sort((a, b) => (b.commentsCount || 0) - (a.commentsCount || 0));
      }

      setPosts(sorted);
    } catch (error) {
      console.error("Error fetching posts:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [filter]);

  if (loading) return <p className="text-center mt-8">Loading posts...</p>;
  if (!posts.length) return <p className="text-center mt-8">No posts yet!</p>;

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 dark:bg-gray-900 transition">
      <h1 className="text-3xl font-bold mb-6 text-center dark:text-white">
        Top Blog Posts
      </h1>

      {/* FILTER BUTTONS */}
      <div className="flex justify-center gap-3 mb-6">
        <button
          onClick={() => setFilter("mostLiked")}
          className={`px-4 py-2 rounded ${
            filter === "mostLiked"
              ? "bg-indigo-600 text-white"
              : "bg-gray-200 dark:bg-gray-700 dark:text-white"
          }`}
        >
          Most Liked
        </button>

        <button
          onClick={() => setFilter("newest")}
          className={`px-4 py-2 rounded ${
            filter === "newest"
              ? "bg-indigo-600 text-white"
              : "bg-gray-200 dark:bg-gray-700 dark:text-white"
          }`}
        >
          Newest
        </button>

        <button
          onClick={() => setFilter("mostCommented")}
          className={`px-4 py-2 rounded ${
            filter === "mostCommented"
              ? "bg-indigo-600 text-white"
              : "bg-gray-200 dark:bg-gray-700 dark:text-white"
          }`}
        >
          Most Commented
        </button>
      </div>

      {/* POST GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {posts.slice(0, displayed).map((post) => (
          <PostCard key={post._id} post={post} />
        ))}
      </div>

      {/* PAGINATION */}
      {displayed < posts.length && (
        <div className="text-center mt-6">
          <button
            onClick={() => setDisplayed((prev) => prev + 4)}
            className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
          >
            Load More
          </button>
        </div>
      )}

      <Footer />
    </div>
  );
}
