import { Link } from "react-router-dom";

export default function PostCard({ post }) {
  return (
    <div className="border rounded-lg shadow-lg overflow-hidden flex flex-col">
      <img
        src={post.image || "/placeholder.png"}
        alt={post.title}
        className="w-full h-48 object-cover"
      />
      <div className="p-4 flex flex-col flex-1">
        <h2 className="text-xl font-semibold mb-2">{post.title}</h2>

        <p className="text-gray-500 text-sm mb-4">
          By {post?.author?.username || "Unknown"}
        </p>

                <p className="text-gray-700 mb-4">
            {post.content.split("\n")[0].slice(0, 200)}{/* first paragraph or first 200 chars */}
            {post.content.length > 200 && "..."}
          </p>


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
