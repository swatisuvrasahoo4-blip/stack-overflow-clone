import express from "express";

import auth from "../middleware/auth.js";
import {  followUser } from "../controller/follow.js"

const router = express.Router();

router.post("/:userId", auth, followUser);

export default router;