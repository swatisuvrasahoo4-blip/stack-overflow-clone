import express from "express";
import auth from "../middleware/auth.js";
import { createPost } from "../controller/post.js";

const router = express.Router();

// Create Community Post
router.post("/create", auth, createPost);

export default router;