import db from "../config/db.js";
import asyncHandler from "express-async-handler";
import { clerkClient } from "@clerk/clerk-sdk-node";

const createNotification = asyncHandler(async (consultation, userRole, io) => {
  try {
    // Check if the consultation is created by a patient
    const patientId = consultation.id_patient;

    // Only create notifications if the user is a patient
    if (userRole === "PATIENT") {
      // Find all dentist accounts
      const dentistAccounts = await db.compte.findMany({
        where: { role: "DENTISTE" },
      });

      // Create notifications for each dentist
      const notifications = await Promise.all(
        dentistAccounts.map(async (dentistAccount) => {
          return db.notification.create({
            data: {
              contenu_notification: `Nouvelle consultation ajoutée par le patient ${consultation.patient.prenom_patient} ${consultation.patient.nom_patient}`,
              date_notification: new Date(),
              id_compte: dentistAccount.id_compte,
              read: false,
            },
          });
        })
      );

      // Emit notifications via Socket.IO
      if (io) {
        notifications.forEach((notification) => {
          io.emit("notificationReceived", notification);
        });
      }

      return notifications;
    }

    return []; // No notifications if not a patient
  } catch (error) {
    console.error("Error creating notifications:", error);
    throw error;
  }
});


// Modifier getNotificationsForUser pour utiliser l'ID de compte
const getNotificationsForUser = asyncHandler(async (req, res) => {
  try {
    const { userId, userRole } = req.query;

    // Trouver le compte correspondant
    const account = await db.compte.findUnique({
      where: {
        id_compte: userId,
        role: userRole,
      },
      select: { id_compte: true },
    });

    if (!account) {
      return res.status(404).json({
        success: false,
        message: "Account not found",
      });
    }

    // Récupérer les notifications pour ce compte
    const notifications = await db.notification.findMany({
      where: {
        id_compte: account.id_compte,
      },
      orderBy: {
        date_notification: "desc",
      },
    });

    res.status(200).json({
      success: true,
      notifications,
    });
  } catch (error) {
    console.error("Error fetching notifications:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching notifications",
    });
  }
});

const deleteNotification = asyncHandler(async (req, res) => {
  const { notificationId } = req.params;

  try {
    await db.notification.delete({
      where: { id_notification: notificationId },
    });

    res.status(200).json({
      success: true,
      message: "Notification deleted",
    });
  } catch (error) {
    console.error("Error deleting notification:", error);
    res.status(500).json({
      success: false,
      message: "Error deleting notification",
    });
  }
});

export { deleteNotification, getNotificationsForUser, createNotification };
