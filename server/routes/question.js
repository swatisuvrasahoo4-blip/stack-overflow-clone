import express from "express";

import {
  Askquestion,
  getallquestion,
  votequestion,
  getQuestionById,
  editQuestion,
  deleteQuestion,
  searchQuestions,
} from "../controller/question.js";

import questionLimit, {
  getQuestionLimitStatus,
} from "../middleware/questionLimit.js";

import optionalAuth from "../middleware/optionalAuth.js";
import auth from "../middleware/auth.js";
import notSuspended from "../middleware/notSuspended.js";

const router = express.Router();

// Ask question
router.post("/ask", auth, notSuspended, questionLimit, Askquestion);

// Get questions
router.get("/getallquestion", getallquestion);

// Edit question
router.patch("/edit/:id", auth, editQuestion);

// Delete question
router.delete("/delete/:id", auth, deleteQuestion);

// Vote question
router.patch("/vote/:id", auth, votequestion);

// Search questions
router.get("/search", searchQuestions);

// Check question limit
router.get("/limit/status", auth, getQuestionLimitStatus);

// Get question by ID
router.get("/:id", optionalAuth, getQuestionById);

export default router;