import express from "express";
import {
  Askquestion,
  deletequestion,
  getallquestion,
  votequestion,
  getQuestionById,
  answerQuestion,
  deleteAnswer
} from "../controller/question.js";

const router = express.Router();
import auth from "../middleware/auth.js";
router.post("/ask", auth, Askquestion);
router.get("/getallquestion", getallquestion);
router.post("/answer/:id",auth,answerQuestion);
router.delete("/delete/:id", auth, deletequestion);
router.delete("/delete-answer/:questionId/:answerId",auth,deleteAnswer);
router.patch("/vote/:id", auth, votequestion);

router.get("/:id",getQuestionById);
export default router;