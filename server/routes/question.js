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

import optionalAuth from "../middleware/optionalAuth.js";

import auth from "../middleware/auth.js";

import notSuspended from "../middleware/notSuspended.js";

import questionLimit from "../middleware/questionLimit.js";

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

// Get question by ID
router.get("/:id", optionalAuth, getQuestionById);

export default router;