import db from "../config/db.js";
import asyncHandler from "express-async-handler";

// Récupérer toutes les planifications
const getPlanification = asyncHandler(async (req, res, next) => {
  const result = await db.planification.findMany({
    include: {
      dentiste: true,
    },
  });
  res.status(200).json(result);
});

// Récupérer une planification par ID
const getPlanificationById = asyncHandler(async (req, res, next) => {
  const id_planification = req.params.id_planification;
  const result = await db.planification.findUnique({
    where: {
      id_planification: id_planification,
    },
  });

  if (!result) {
    res.status(404).json({ message: "Planification non trouvée" });
  } else {
    res.status(200).json(result);
  }
});

// Créer une nouvelle planification
const createPlanification = asyncHandler(async (req, res, next) => {
  const body = req.body;

  const result = await db.planification.create({
    data: {
      ...body,
      id_dentiste: body.id_dentiste,
    },
  });

  res.status(201).json({
    message: "Planification créée avec succès",
    planification: result,
  });
});

// Mettre à jour une planification existante
const updatePlanification = asyncHandler(async (req, res, next) => {
  const id_planification = req.params.id_planification;
  const body = req.body;

  const result = await db.planification.update({
    where: {
      id_planification: id_planification,
    },
    data: {
      ...body,
    },
  });

  res.status(200).json({
    message: "Planification mise à jour avec succès",
    planification: result,
  });
});

// Supprimer une planification
const deletePlanification = asyncHandler(async (req, res, next) => {
  const id_planification = req.params.id_planification;

  const result = await db.planification.delete({
    where: {
      id_planification: id_planification,
    },
  });

  res.status(200).json({
    message: "Planification supprimée avec succès",
    planification: result,
  });
});

export {
  getPlanification,
  getPlanificationById,
  createPlanification,
  updatePlanification,
  deletePlanification,
};
