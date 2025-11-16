import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api/axiosInstance";
import { useAuth } from "../context/AuthContext";

export default function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { setUser } = useAuth();

  const submit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/auth/register", { username, email, password });
      localStorage.setItem("token", res.data.token); // save JWT
      setUser(res.data);
      navigate("/");
    } catch (err) {
      alert(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-16 p-6 bg-white shadow rounded">
      <h2 className="text-2xl font-bold mb-4 text-center">Create Account</h2>
      <form className="flex flex-col gap-3" onSubmit={submit}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={e => setUsername(e.target.value)}
          className="border p-2 rounded"
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          className="border p-2 rounded"
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          className="border p-2 rounded"
          required
        />
        <button
          type="submit"
          className="bg-primary text-black py-2 rounded hover:bg-red-500"
        >
          Register
        </button>
      </form>
      <p className="mt-3 text-sm text-gray-600 text-center">
        Already have an account?{" "}
        <Link to="/login" className="text-accent hover:underline">Login</Link>
      </p>
    </div>
  );
}
