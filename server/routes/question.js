import express from "express";
import {
  Askquestion,
  deletequestion,
  getallquestion,
  votequestion,
  getQuestionById,
  answerQuestion,
  deleteAnswer,
  editQuestion,
  deleteQuestion,
  searchQuestions,
} from "../controller/question.js";
import auth from "../middleware/auth.js";
import notSuspended from "../middleware/notSuspended.js";
import questionLimit from "../middleware/questionLimit.js";
const router = express.Router();

router.post("/ask", auth, notSuspended, questionLimit, Askquestion);
router.get("/getallquestion", getallquestion);
router.patch("/edit/:id", auth, editQuestion);
router.delete("/delete/:id", auth, deleteQuestion);
router.post("/answer/:id",auth,answerQuestion);
router.delete("/delete-answer/:questionId/:answerId",auth,deleteAnswer);
router.patch("/vote/:id", auth, votequestion);
router.get("/search", searchQuestions);
router.get("/:id",getQuestionById);
export default router;