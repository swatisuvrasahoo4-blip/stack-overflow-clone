import express from "express";
import {
  getNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteNotification,
} from "../controller/notification.js";
import auth from "../middleware/auth.js";

const router = express.Router();

router.get("/", auth, getNotifications);

router.patch(
  "/read-all",
  auth,
  markAllNotificationsAsRead
);

router.patch(
  "/:notificationId/read",
  auth,
  markNotificationAsRead
);

router.delete(
  "/:notificationId",
  auth,
  deleteNotification
);

export default router;