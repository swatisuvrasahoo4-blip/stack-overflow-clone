import express from "express";
import {
  getallusers,
  Login,
  Signup,
  checkUsername,
  updateprofile,
  getMySessions,
  revokeSession,
  logoutSession,
} from "../controller/auth.js";
import { verifyLoginDeviceOtp } from "../controller/loginOtp.js";

import auth from "../middleware/auth.js";
import { profileUpload } from "../middleware/upload.js";

const router = express.Router();
router.post("/signup", Signup);
router.post("/login", Login);
router.post("/login/verify-device", verifyLoginDeviceOtp);
router.get("/getalluser", getallusers);
router.get("/check-username", checkUsername);
router.patch(
  "/update/:id",
  auth,
  profileUpload.single("profilePhoto"),
  updateprofile
);
router.get("/sessions", auth, getMySessions);
router.patch("/sessions/:sessionId/revoke", auth, revokeSession);
router.patch("/sessions/logout", auth, logoutSession);

export default router;