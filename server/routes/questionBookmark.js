import express from "express";
import auth from "../middleware/auth.js";
import { toggleQuestionBookmark, getQuestionBookmarks } from "../controller/questionBookmark.js";

const router = express.Router();

router.post("/toggle", auth, toggleQuestionBookmark);
router.get("/get/:userId", auth, getQuestionBookmarks);

export default router;