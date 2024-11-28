import db from "../config/db.js";
import asyncHandler from "express-async-handler";
import PDFDocument from "pdfkit";
import moment from "moment";
import { createNotification } from "./notification.controller.js";


// Récupérer toutes les consultations
const getConsultation = asyncHandler(async (req, res, next) => {
  const result = await db.consultation.findMany({
    include: {
      patient: true, // Inclure les données du patient
    },
  });
  res.status(200).json(result);
});

// Récupérer une consultation par ID
const getConsultationById = asyncHandler(async (req, res, next) => {
  const id_consultation = req.params.id_consultation;
  const result = await db.consultation.findUnique({
    where: {
      id_consultation: id_consultation,
    },
    include: {
      patient: true, // Inclure les données du patient
    },
  });
  if (!result) {
    res.status(404).json({ message: "Consultation non trouvée" });
  } else {
    res.status(200).json(result);
  }
});

// Créer une nouvelle consultation
const createConsultation = asyncHandler(async (req, res, next) => {
  const body = req.body;
  const userRole = body.userRole; // Get user role from request body

  const result = await db.consultation.create({
    data: {
      ...body,
      id_patient: body.id_patient,
    },
    include: {
      patient: true,
    },
  });

  // Pass user role to notification creation
  const notifications = await createNotification(result, userRole, req.io);

  req.io.emit("createConsultation", result);

  res.status(201).json({
    message: "Consultation créée avec succès",
    consultation: result,
    notifications: notifications,
  });
});

// Mettre à jour une consultation existante
const updateConsultation = asyncHandler(async (req, res, next) => {
  const id_consultation = req.params.id_consultation;
  const body = req.body;

  const result = await db.consultation.update({
    where: {
      id_consultation: id_consultation,
    },
    data: {
      ...body,
    },
  });
  req.io.emit("updateConsultation", result);

  res.status(200).json({
    message: "Consultation mise à jour avec succès",
    consultation: result,
  });
});

// Supprimer une consultation
const deleteConsultation = asyncHandler(async (req, res, next) => {
  const id_consultation = req.params.id_consultation;

  const result = await db.consultation.delete({
    where: {
      id_consultation: id_consultation,
    },
  });
  req.io.emit("deleteConsultation", result);

  res.status(200).json({
    message: "Consultation supprimée avec succès",
    consultation: result,
  });
});

const generateConsultationPDF = asyncHandler(async (req, res, next) => {
  try {
    const id_consultation = req.params.id_consultation;
    // Get consultation data with patient info
    const consultation = await db.consultation.findUnique({
      where: {
        id_consultation: id_consultation,
      },
      include: {
        patient: true,
      },
    });

    if (!consultation) {
      return res.status(404).json({ message: "Consultation non trouvée" });
    }

    // Create PDF document
    const doc = new PDFDocument({
      size: "A4",
      margin: 50,
    });

    // Set response headers
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=consultation_${id_consultation}.pdf`
    );

    // Pipe the PDF into the response
    doc.pipe(res);

    // Add header with logo/clinic information
    doc
      .fontSize(16)
      .font("Helvetica-Bold")
      .text("Cabinet Dentaire, 6 Rue Flayelle", { align: "center" })
      .moveDown();

    // Add title
    doc
      .fontSize(18)
      .font("Helvetica-Bold")
      .fillColor("#333333")
      .text("Reçu de Consultation", { align: "center" })
      .moveDown(1.5);

    // Consultation Details Section
    doc
      .fontSize(12)
      .font("Helvetica")
      .fillColor("black")
      .text(`Date: `, { continued: true })
      .font("Helvetica-Bold")
      .text(moment(consultation.date_consultation).format("DD/MM/YYYY"))
      .moveDown(0.5);

    doc
      .font("Helvetica")
      .text(`Heure: `, { continued: true })
      .font("Helvetica-Bold")
      .text(consultation.heures || "Non spécifiée")
      .moveDown(0.5);

    // Patient Information
    doc
      .font("Helvetica")
      .text(`Patient: `, { continued: true })
      .font("Helvetica-Bold")
      .text(
        `${consultation.patient.prenom_patient} ${consultation.patient.nom_patient}`
      )
      .moveDown(0.5);

    // Additional Consultation Details
    doc
      .font("Helvetica")
      .text(`Motif: `, { continued: true })
      .font("Helvetica-Bold")
      .text(consultation.motif || "Non spécifié")
      .moveDown(2);

    // Separator
    doc
      .strokeColor("#CCCCCC")
      .lineWidth(1)
      .moveTo(50, doc.y)
      .lineTo(550, doc.y)
      .stroke()
      .moveDown(1);

    // Footer
    doc
      .fontSize(10)
      .font("Helvetica")
      .fillColor("#666666")
      .text("Ce document est un reçu officiel de consultation.", {
        align: "center",
      })
      .text("Email : tinafindrama@hotmail.fr", {
        align: "center",
      });

    // Finalize the PDF
    doc.end();
  } catch (error) {
    console.error("Erreur lors de la génération du PDF:", error);
    res.status(500).json({
      message: "Erreur lors de la génération du PDF",
      error: error.message,
    });
  }
});

export {
  getConsultation,
  getConsultationById,
  createConsultation,
  updateConsultation,
  deleteConsultation,
  generateConsultationPDF,
};
