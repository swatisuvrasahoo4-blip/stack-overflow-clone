import express from "express";
import { Askanswer, deleteanswer, acceptAnswer, voteAnswer } from "../controller/answer.js";

import auth from "../middleware/auth.js";

const router = express.Router();

router.post("/postanswer/:id",auth, Askanswer);
router.delete("/delete/:questionId/:answerId", auth, deleteanswer);
router.patch(
  "/accept/:questionId/:answerId",
  auth,
  acceptAnswer
);
router.patch(
  "/vote/:questionId/:answerId",
  auth,
  voteAnswer
);


export default router;