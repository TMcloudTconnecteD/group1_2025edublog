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
  const posts = await Post.find()
    .populate("author", "username")
    .populate("likes", "username")
    .sort({ createdAt: -1 });

  // We add commentsCount dynamically
  const postsWithCounts = await Promise.all(
    posts.map(async (post) => {
      const commentCount = await Comment.countDocuments({ post: post._id });
      return {
        ...post.toObject(),
        commentsCount: commentCount,
      };
    })
  );

  res.json(postsWithCounts);
};


// Get single post by ID
export const getPostById = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate("author", "username");

    if (!post) return res.status(404).json({ message: "Post not found" });

    res.json(post);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error fetching post" });
  }
};

// Like/unlike a post
// postController.js

export const likePost = async (req, res) => {
  const { id } = req.params; // postId
  const userId = req.user._id;

  try {
    const post = await Post.findById(id);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    // Toggle like: add/remove user
    if (post.likes.includes(userId)) {
      post.likes.pull(userId);
    } else {
      post.likes.push(userId);
    }

    await post.save();

    // ✅ Important: populate likes with username for frontend
    const updatedPost = await Post.findById(id).populate("likes", "username");

    res.json(updatedPost);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
