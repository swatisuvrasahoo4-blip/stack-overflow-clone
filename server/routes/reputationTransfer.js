import express from "express";
import auth from "../middleware/auth.js";
import { transferReputation } from "../controller/reputationTransfer.js";

const router = express.Router();

// Transfer reputation points
router.post("/", auth, transferReputation);

export default router;