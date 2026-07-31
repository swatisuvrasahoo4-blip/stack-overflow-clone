import express from "express";

import auth from "../middleware/auth.js";
import {  followUser, unfollowUser, getFollowStatus, getFollowCounts, getFollowers,getFollowing } from "../controller/follow.js"

const router = express.Router();

router.post("/:userId", auth, followUser);
router.delete("/:userId",auth,unfollowUser);
router.get("/followers/:userId",getFollowers);
router.get("/following/:userId",getFollowing);
router.get("/:userId", auth, getFollowStatus);
router.get("/count/:userId",getFollowCounts);

export default router;