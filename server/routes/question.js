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
} from "../controller/question.js";
import auth from "../middleware/auth.js";
import notSuspended from "../middleware/notSuspended.js";
const router = express.Router();

router.post("/ask", auth, notSuspended, Askquestion);
router.get("/getallquestion", getallquestion);
router.patch("/edit/:id", auth, editQuestion);
router.delete("/delete/:id", auth, deleteQuestion);
router.post("/answer/:id",auth,answerQuestion);
router.delete("/delete/:id", auth, deletequestion);
router.delete("/delete-answer/:questionId/:answerId",auth,deleteAnswer);
router.patch("/vote/:id", auth, votequestion);

router.get("/:id",auth,getQuestionById);
export default router;