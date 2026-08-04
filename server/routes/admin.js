import express from "express";

import auth from "../middleware/auth.js";
import admin from "../middleware/admin.js";

import {
  suspendUser,
  unsuspendUser,
} from "../controller/admin.js";

const router = express.Router();

router.patch(
  "/users/:userId/suspend",
  auth,
  admin,
  suspendUser
);

router.patch(
  "/users/:userId/unsuspend",
  auth,
  admin,
  unsuspendUser
);

export default router;