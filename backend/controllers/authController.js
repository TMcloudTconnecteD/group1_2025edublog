import Member from "../models/userModel.js";
import jwt from "jsonwebtoken";

const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET || "secret123", { expiresIn: "30d" });

// REGISTER
export const registerUser = async (req, res) => {
  const { username, email, password } = req.body;


  console.log("🔐 New user registered:", { username, email });

  
  if (!username || !email || !password)
    return res.status(400).json({ message: "All fields required" });

  const userExists = await Member.findOne({ email });
  if (userExists) return res.status(400).json({ message: "User already exists" });

  const user = await Member.create({ username, email, password });
  if (!user) return res.status(400).json({ message: "Failed to create user" });

  res.status(201).json({
    _id: user._id,
    username: user.username,
    email: user.email,
    token: generateToken(user._id),
  });
};

// LOGIN
export const loginUser = async (req, res) => {
  console.log("Login body:", req.body); // DEBUG
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).json({ message: "All fields required" });

  const user = await Member.findOne({ email });
  if (!user) return res.status(400).json({ message: "Invalid credentials" });

  const isMatch = await user.matchPassword(password);
  if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

  res.json({
    _id: user._id,
    username: user.username,
    email: user.email,
    token: generateToken(user._id),
  });
};
