import express from "express";
import {
  createReport,
  getReports,
  checkReportStatus,
  updateReportStatus,
} from "../controller/report.js";
import auth from "../middleware/auth.js";
import admin from "../middleware/admin.js";

const router = express.Router();

router.get("/check/:type/:contentId",auth, checkReportStatus);

router.post("/", auth, createReport);

router.get("/", auth, admin, getReports);

router.patch("/:reportId",auth,admin,updateReportStatus);

export default router;