import Post from "../models/post.js";

// Create a new post
export const createPost = async (req, res) => {
  const { title, content, image } = req.body;

  if (!title || !content) {
    return res.status(400).json({ message: "Title and content are required" });
  }

  try {
    const post = await Post.create({
      title,
      content,
      image,
      author: req.user._id, // req.user is from authMiddleware
    });

    res.status(201).json(post);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error creating post" });
  }
};

// Get all posts
export const getPosts = async (req, res) => {
  try {
    const posts = await Post.find()
      .populate("author", "username email") // populate Member info
      .sort({ createdAt: -1 });

    res.json(posts);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error fetching posts" });
  }
};

// Get single post by ID
export const getPostById = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate("author", "username email");

    if (!post) return res.status(404).json({ message: "Post not found" });

    res.json(post);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error fetching post" });
  }
};

// Like/unlike a post
export const likePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    const userId = req.user._id;

    // Toggle like
    if (post.likes.includes(userId)) {
      post.likes.pull(userId);
    } else {
      post.likes.push(userId);
    }

    await post.save();

    // Populate likes with username for frontend
    await post.populate("likes", "username");

    res.json({ 
      likes: post.likes, // array of { _id, username }
      likesCount: post.likes.length // number of likes
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error liking post" });
  }
};