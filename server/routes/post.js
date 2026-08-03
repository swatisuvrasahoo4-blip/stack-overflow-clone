import express from "express";
import auth from "../middleware/auth.js";
import { createPost, getAllPosts, likePost, addComment, replyToComment, deletePost, deleteComment, deleteReply, getPostById, editPost  } from "../controller/post.js";
import upload from "../middleware/upload.js";
import cloudinaryUpload from "../middleware/cloudinaryUpload.js";

const router = express.Router();

const handleMulterError = (err, req, res, next) => {
  if (err) {
    console.log(err);
    
    return res.status(400).json({
      success: false,
      message: err.message || "File upload failed",
    });
  }
  next();
};

router.post("/create", auth, cloudinaryUpload.single("image"), handleMulterError, createPost);
router.get("/",getAllPosts);
router.get("/:id",getPostById);
router.put("/like/:id",auth,likePost);
router.post("/comment/:id", auth, addComment);
router.post("/reply/:id/:commentId", auth, replyToComment);
router.put("/:id",auth,editPost);
router.delete("/:id",auth,deletePost);
router.delete("/:postId/comment/:commentId",auth,deleteComment);
router.delete("/:postId/comment/:commentId/reply/:replyId",auth,deleteReply);


export default router;