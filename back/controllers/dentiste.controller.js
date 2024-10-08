import db from "../config/db.js";
import asyncHandler from "express-async-handler";

// Récupérer tous les dentistes
const getDentiste = asyncHandler(async (req, res, next) => {
  const result = await db.dentiste.findMany();
  res.status(200).json(result);
});

// Récupérer un dentiste par ID
const getDentisteById = asyncHandler(async (req, res, next) => {
  const id = req.params.id;
  const result = await db.dentiste.findUnique({
    where: {
      id_dentiste: id,
    },
  });

  if (!result) {
    res.status(404).json({ message: "Dentiste non trouvé" });
  } else {
    res.status(200).json(result);
  }
});

// Créer un nouveau dentiste
const createDentiste = asyncHandler(async (req, res, next) => {
  const body = req.body;

  const result = await db.dentiste.create({
    data: {
      ...body,
    },
  });

  res.status(201).json({
    message: "Dentiste créé avec succès",
    dentiste: result,
  });
});

// Mettre à jour un dentiste existant
const updateDentiste = asyncHandler(async (req, res, next) => {
  const id = req.params.id;
  const body = req.body;

  const result = await db.dentiste.update({
    where: {
      id_dentiste: id,
    },
    data: {
      ...body,
    },
  });

  res.status(200).json({
    message: "Dentiste mis à jour avec succès",
    dentiste: result,
  });
});

// Supprimer un dentiste
const deleteDentiste = asyncHandler(async (req, res, next) => {
  const id = req.params.id;

  const result = await db.dentiste.delete({
    where: {
      id_dentiste: id,
    },
  });

  res.status(200).json({
    message: "Dentiste supprimé avec succès",
    dentiste: result,
  });
});

export {
  getDentiste,
  getDentisteById,
  createDentiste,
  updateDentiste,
  deleteDentiste,
};
