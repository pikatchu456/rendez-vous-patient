import { Router } from "express";
import {
  getNotificationsForUser,
  deleteNotification,
} from "../controllers/notification.controller.js";
import { clerkClient } from "@clerk/clerk-sdk-node";

const notification_router = Router();

notification_router.get("/notifications", getNotificationsForUser);

notification_router.delete(
  "/notifications/:notificationId",
  deleteNotification
);

export default notification_router;
