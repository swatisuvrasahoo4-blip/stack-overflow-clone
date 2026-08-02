import express from "express";
import {
  getallusers,
  Login,
  Signup,
  checkUsername,
  updateprofile,
} from "../controller/auth.js";

import auth from "../middleware/auth.js";
import { profileUpload } from "../middleware/upload.js";

const router = express.Router();
router.post("/signup", Signup);
router.post("/login", Login);
router.get("/getalluser", getallusers);
router.get("/check-username", checkUsername);
router.patch(
  "/update/:id",
  auth,
  profileUpload.single("profilePhoto"),
  updateprofile
);
export default router;