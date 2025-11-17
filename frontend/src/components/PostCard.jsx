import { Link } from "react-router-dom";

export default function PostCard({ post }) {
  const likeCount = post.likes?.length || 0;
  const isTrending = likeCount >= 5;

  return (
    <div className="border rounded-lg shadow-lg overflow-hidden flex flex-col bg-white dark:bg-gray-800 transition">
      
      {/* Trending badge */}
      {isTrending && (
        <span className="absolute bg-red-600 text-white px-3 py-1 text-xs font-bold rounded-br-lg">
          🔥 Trending
        </span>
      )}

      <img
        src={post.image || "/placeholder.png"}
        alt={post.title}
        className="w-full h-48 object-cover"
      />

      <div className="p-4 flex flex-col flex-1">
        <h2 className="text-xl font-semibold mb-2 dark:text-white">{post.title}</h2>

        <p className="text-gray-500 dark:text-gray-300 text-sm mb-4">
          By {post?.author?.username || "Unknown"}
        </p>

        {/* First paragraph only */}
        <p className="text-gray-700 dark:text-gray-300 mb-4">
          {post.content.split("\n")[0].slice(0, 200)}
          {post.content.length > 200 && "..."}
        </p>

        {/* Stats row */}
        <div className="text-sm mb-3 text-gray-500 dark:text-gray-400 flex gap-4">
          <span>❤️ {post.likes?.length || 0}</span>
          <span>💬 {post.commentsCount || 0}</span>
        </div>

        <Link
          to={`/blog/${post._id}`}
          className="mt-auto px-3 py-1 bg-indigo-600 text-white rounded hover:bg-indigo-700 text-center"
        >
          Read more
        </Link>
      </div>
    </div>
  );
}
