import Post from "../models/post.js";
import Comment from "../models/comment.js";

// ===============================
// Create Post
// ===============================
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
      author: req.user._id,
    });

    res.status(201).json(post);
  } catch (err) {
    console.error("Create post error:", err);
    res.status(500).json({ message: "Server error creating post" });
  }
};

// ===============================
// Get All Posts
// ===============================
export const getPosts = async (req, res) => {
  try {
    const posts = await Post.find()
      .populate("author", "username")
      .populate("likes", "username")
      .sort({ createdAt: -1 });

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
  } catch (err) {
    console.error("Get posts error:", err);
    res.status(500).json({ message: "Server error fetching posts" });
  }
};

// ===============================
// Get Single Post
// ===============================
export const getPostById = async (req, res) => {
  try {
    let post = await Post.findById(req.params.id)
      .populate("author", "username")
      .populate("likes", "username");

    if (!post) return res.status(404).json({ message: "Post not found" });

    // Add comment count
    const commentCount = await Comment.countDocuments({ post: post._id });
    post = {
      ...post.toObject(),
      commentsCount: commentCount,
    };

    res.json(post);
  } catch (err) {
    console.error("Get post error:", err);
    res.status(500).json({ message: "Server error fetching post" });
  }
};

// ===============================
// Like / Unlike Post
// ===============================
export const likePost = async (req, res) => {
  const { id } = req.params;
  const userId = req.user._id;

  try {
    const post = await Post.findById(id);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    // FIXED: Mongoose ObjectId comparison
    const alreadyLiked = post.likes.some((u) => u.equals(userId));

    if (alreadyLiked) {
      post.likes.pull(userId);
    } else {
      post.likes.push(userId);
    }

    await post.save();

    // Populate likes for frontend
    const updatedPost = await Post.findById(id)
      .populate("author", "username")
      .populate("likes", "username");

    res.json(updatedPost);
  } catch (err) {
    console.error("Like error:", err);
    res.status(500).json({ message: "Server error liking post" });
  }
};
// ===============================
// Get logged-in user's posts
// ===============================
export const getUserPosts = async (req, res) => {
  try {
    const posts = await Post.find({ author: req.user._id })
      .populate("author", "username")
      .populate("likes", "username")
      .sort({ createdAt: -1 });

    res.json(posts);
  } catch (err) {
    console.error("Get user posts error:", err);
    res.status(500).json({ message: "Server error fetching user posts" });
  }
};
