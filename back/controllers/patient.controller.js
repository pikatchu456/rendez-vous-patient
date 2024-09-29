import db from "../config/db.js";
import asyncHandler from "express-async-handler";

// Récupérer tous les patients
const getPatient = asyncHandler(async (req, res, next) => {
  const result = await db.patient.findMany();
  res.status(200).json(result);
});

// Récupérer un patient par ID
const getPatientById = asyncHandler(async (req, res, next) => {
  const id = req.params.id;
  const result = await db.patient.findUnique({
    where: {
      id_patient: id,
    },
  });

  if (!result) {
    res.status(404).json({ message: "Patient non trouvé" });
  } else {
    res.status(200).json(result);
  }
});

// Créer un nouveau patient
const createPatient = asyncHandler(async (req, res, next) => {
  const body = req.body;

  const result = await db.patient.create({
    data: {
      ...body,
    },
  });

  res.status(201).json({
    message: "Patient créé avec succès",
    patient: result,
  });
});

// Mettre à jour un patient existant
const updatePatient = asyncHandler(async (req, res, next) => {
  const id = req.params.id;
  const body = req.body;

  const result = await db.patient.update({
    where: {
      id_patient: id,
    },
    data: {
      ...body,
    },
  });

  res.status(200).json({
    message: "Patient mis à jour avec succès",
    patient: result,
  });
});

// Supprimer un patient
const deletePatient = asyncHandler(async (req, res, next) => {
  const id = req.params.id;

  const result = await db.patient.delete({
    where: {
      id_patient: id,
    },
  });

  res.status(200).json({
    message: "Patient supprimé avec succès",
    patient: result,
  });
});

export {
  getPatient,
  getPatientById,
  createPatient,
  updatePatient,
  deletePatient,
};
