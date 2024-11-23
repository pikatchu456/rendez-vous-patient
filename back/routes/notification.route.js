import { Router } from "express";
import { authMiddleware, getAllNotification,  } from "../controllers/notification.controller";

const notification_router = Router();

notification_router.post(
  "/get-all-notification",
  authMiddleware,
  getAllNotification
);
