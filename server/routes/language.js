import express from "express";
import { sendLanguageOtp, verifyLanguageOtp } from "../controller/language.js";
import auth from "../middleware/auth.js";

const router = express.Router();

router.post("/send-otp", auth, sendLanguageOtp);
router.post("/verify-otp", auth, verifyLanguageOtp);

export default router;