import db from "../config/db.js";
import asyncHandler from "express-async-handler";

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

  const result = await db.consultation.create({
    data: {
      ...body,
      id_patient: body.id_patient,
    },
  });

  res.status(201).json({
    message: "Consultation créée avec succès",
    consultation: result,
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

  res.status(200).json({
    message: "Consultation supprimée avec succès",
    consultation: result,
  });
});

export {
  getConsultation,
  getConsultationById,
  createConsultation,
  updateConsultation,
  deleteConsultation,
};
