import {
  createPost,
  updatePost,
  deletePost,
  getPosts,
  getPostAll,
} from "../controllers/post.controller.js";
import express from "express";

const router = express.Router();

// POST /api/posts
router.post("/create", createPost);
router.post("/update/:id", updatePost);
router.delete("/delete/:id", deletePost);

// GET /api/posts
router.get("/getAll", getPostAll);

// GET /api/posts/:id
router.get("/:id", getPosts);

export default router;
