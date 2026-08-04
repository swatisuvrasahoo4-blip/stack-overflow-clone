import express from "express";
import { changePassword } from "../controller/changePassword.js";
import auth from "../middleware/auth.js";

const router = express.Router();

router.put("/", auth, changePassword);

export default router;