import { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/axiosInstance";
import { useAuth } from "../context/AuthContext";

export default function EditPost() {
  const { user } = useAuth();
  const { id } = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    const fetchPost = async () => {
      try {
        const res = await api.get(`/posts/${id}`);
        if (res.data.user?._id !== user._id) {
          alert("You cannot edit someone else's post!");
          navigate("/");
          return;
        }
        setTitle(res.data.title);
        setContent(res.data.content);
        setImageUrl(res.data.image || "");
      } catch (err) {
        console.error(err);
      }
    };

    fetchPost();
  }, [id, user]);

  const upload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const fd = new FormData();
    fd.append("image", file);
    try {
      setUploading(true);
      const res = await api.post("/upload", fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setImageUrl(res.data.url);
    } catch (err) {
      alert("Upload failed");
      console.error(err);
    } finally {
      setUploading(false);
    }
  };

  const submit = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/posts/${id}`, { title, content, image: imageUrl });
      navigate("/profile");
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update post");
      console.error(err);
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-8 p-4">
      <h2 className="text-2xl font-bold mb-4">Edit Post</h2>
      <form onSubmit={submit} className="flex flex-col gap-4">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Title"
          required
          className="border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={6}
          placeholder="Content"
          required
          className="border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input type="file" onChange={upload} className="border p-2 rounded" />
        {uploading && <small className="text-gray-500">Uploading image...</small>}
        {imageUrl && <img src={imageUrl} className="w-full h-64 object-cover rounded" alt="" />}
        <button
          type="submit"
          className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition-colors"
        >
          Update Post
        </button>
      </form>
    </div>
  );
}
