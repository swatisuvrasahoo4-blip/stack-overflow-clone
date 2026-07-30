import express from "express";
import { toggleBookmark, getBookmarkedPosts } from "../controller/bookmark.js";

const router = express.Router();

router.post("/toggle", toggleBookmark);
router.get("/:userId",getBookmarkedPosts)

export default router;