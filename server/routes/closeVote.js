import express from "express";
import { voteToCloseQuestion } from "../controller/closeVote.js";
import auth from "../middleware/auth.js";

const router = express.Router();

router.put("/:questionId", auth, voteToCloseQuestion);

export default router;