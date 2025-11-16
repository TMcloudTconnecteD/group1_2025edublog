import Comment from "../models/comment.js";

export const addComment = async (req, res) => {
  const { text } = req.body;

  if (!text) {
    return res.status(400).json({ message: "Comment text required" });
  }

  const comment = await Comment.create({
    post: req.params.id,
    user: req.user._id,
    text,
  });

  res.status(201).json(comment);
};

export const getComments = async (req, res) => {
  const comments = await Comment.find({ post: req.params.id })
    .populate("user", "username")
    .sort({ createdAt: -1 });

  res.json(comments);
};
