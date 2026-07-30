import express from "express";
import auth from "../middleware/auth.js";
import { createPost, getAllPosts, likePost, addComment, replyToComment, deletePost, deleteComment, deleteReply, getPostById,  } from "../controller/post.js";

const router = express.Router();

// Create Community Post
router.post("/create", auth, createPost);
router.get("/",getAllPosts);
router.get("/:id",getPostById);
router.put("/like/:id",auth,likePost);
router.post("/comment/:id", auth, addComment);
router.post("/reply/:id/:commentId", auth, replyToComment);
router.delete("/:id",auth,deletePost);
router.delete("/:postId/comment/:commentId",auth,deleteComment);
router.delete("/:postId/comment/:commentId/reply/:replyId",auth,deleteReply);


export default router;