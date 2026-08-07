import express from "express";
import { createSupportRequest, getSupportRequests,resolveSupportRequest } from "../controller/support.js";
import auth from "../middleware/auth.js";
import admin from "../middleware/admin.js";

const router = express.Router();

router.post("/", auth, createSupportRequest);
router.get("/", auth, getSupportRequests);
router.patch(
  "/:id/resolve",
  auth,
  admin,
  resolveSupportRequest
);

export default router;