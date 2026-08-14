import express from "express";
import { getMyReputationActivity, getUserReputationActivity } from "../controller/reputationActivity.js";
import auth from "../middleware/auth.js";

const router = express.Router();

router.get("/my-activity", auth, getMyReputationActivity);
router.get("/user/:userId", getUserReputationActivity);

export default router;