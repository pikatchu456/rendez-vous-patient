import db from "../config/db.js";
import asyncHandler from "express-async-handler";

// Récupérer toutes les consultations
const getConsultation = asyncHandler(async (req, res, next) => {
  const result = await db.consultation.findMany();
  res.status(200).json(result);
});

// Récupérer une consultation par ID
const getConsultationById = asyncHandler(async (req, res, next) => {
  const id = req.params.id;
  const result = await db.consultation.findUnique({
    where: {
      id_consultation: id,
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
    },
  });

  res.status(201).json({
    message: "Consultation créée avec succès",
    consultation: result,
  });
});

// Mettre à jour une consultation existante
const updateConsultation = asyncHandler(async (req, res, next) => {
  const id = req.params.id;
  const body = req.body;

  const result = await db.consultation.update({
    where: {
      id_consultation: id,
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
  const id = req.params.id;

  const result = await db.consultation.delete({
    where: {
      id_consultation: id,
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
