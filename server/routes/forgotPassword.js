import express from "express";
import { forgotPassword } from "../controller/forgotPassword.js";

const router = express.Router();

router.post("/", forgotPassword);

export default router;