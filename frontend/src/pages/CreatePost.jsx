import { useState } from "react";
import api from "../api/axiosInstance";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function CreatePost() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [uploading, setUploading] = useState(false);

  const { user } = useAuth();
  const navigate = useNavigate();

  if (!user) {
    navigate("/login");
    return null;
  }

  const upload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const fd = new FormData();
    fd.append("image", file);

    try {
      setUploading(true);
      const res = await api.post("/upload", fd);
      setImageUrl(res.data.url);
    } catch (err) {
      console.log(err);
      alert("Image upload failed");
    } finally {
      setUploading(false);
    }
  };

  const submit = async (e) => {
    e.preventDefault();

    try {
      const res = await api.post("/posts", {
        title,
        content,
        image: imageUrl,
      });

      navigate(`/blog/${res.data._id}`);
    } catch (err) {
      console.log(err);
      alert(err.response?.data?.message || "Failed to create post");
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4 bg-white shadow rounded mt-8">
      <h2 className="text-2xl font-bold mb-4">Create Post</h2>

      <form className="flex flex-col gap-4" onSubmit={submit}>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Title"
          className="border p-2 rounded"
          required
        />

        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Content"
          rows={6}
          className="border p-2 rounded"
          required
        />

        <input type="file" onChange={upload} />

        {uploading && <p>Uploading...</p>}

        {imageUrl && (
          <img
            src={imageUrl}
            className="w-full h-64 object-cover rounded"
            alt=""
          />
        )}

        <button className="bg-secondary text-gray-800 px-4 py-2 rounded">
          Publish
        </button>
      </form>
    </div>
  );
}
