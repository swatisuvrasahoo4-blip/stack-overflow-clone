import express from "express";
import {
  createReport,
  getReports,
  checkReportStatus,
} from "../controller/report.js";
import auth from "../middleware/auth.js";

const router = express.Router();

router.get("/check/:postId",auth, checkReportStatus);

router.post("/", auth, createReport);

router.get("/", auth, getReports);

export default router;