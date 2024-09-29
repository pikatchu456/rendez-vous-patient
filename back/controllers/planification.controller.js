import db from "../config/db.js";
import asyncHandler from "express-async-handler";

// Récupérer toutes les planifications
const getPlanification = asyncHandler(async (req, res, next) => {
  const result = await db.planification.findMany();
  res.status(200).json(result);
});

// Récupérer une planification par ID
const getPlanificationById = asyncHandler(async (req, res, next) => {
  const id = req.params.id;
  const result = await db.planification.findUnique({
    where: {
      id_planification: id,
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
    },
  });

  res.status(201).json({
    message: "Planification créée avec succès",
    planification: result,
  });
});

// Mettre à jour une planification existante
const updatePlanification = asyncHandler(async (req, res, next) => {
  const id = req.params.id;
  const body = req.body;

  const result = await db.planification.update({
    where: {
      id_planification: id,
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
  const id = req.params.id;

  const result = await db.planification.delete({
    where: {
      id_planification: id,
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
