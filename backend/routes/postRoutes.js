import express from "express";
import {
  createPost,
  getPosts,
  getPostById,
  likePost,
} from "../controllers/postController.js";
import { protect } from "../middlewares/authMiddleware.js";
import { addComment, getComments } from "../controllers/commentController.js";

const router = express.Router();

// GET posts
router.get("/", protect, getPosts);
router.get("/:id", protect, getPostById);

// POST actions
router.post("/", protect, createPost);
router.post("/:id/like", protect, likePost);
router.post("/:id/comments", protect, addComment);

// GET comments
router.get("/:id/comments", protect, getComments);

export default router;
