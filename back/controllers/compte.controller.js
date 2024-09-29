import asyncHandler from "express-async-handler";
import db from "../config/db.js";

const createCompteDentisteIntervenant = asyncHandler(async (req, res, next) => {
  const compte = await db.compte.create({
    data: {
      ...req.body,
      role: "DENTISTE_INTERVENANT",
    },
  });
  res
    .status(200)
    .json({ message: "Dentiste intervenants creer avec succès", compte });
});

const createCompteDentiste = asyncHandler(async (req, res, next) => {
  const compte = await db.compte.create({
    data: {
      ...req.body,
      role: "DENTISTE",
    },
  });
  res.status(200).json({ message: "Dentiste creer avec succès", compte });
});

const createComptePatient = asyncHandler(async (req, res, next) => {
  const compte = await db.compte.create({
    data: {
      ...req.body,
    },
  });
  res.status(200).json({ message: "Patient creer avec succès", compte });
});

const getAllCompte = asyncHandler(async (req, res, next) => {
  const comptes = await db.compte.findMany({
    include: {
      patient: true,
    },
  });
  res.status(200).json(comptes);
});

const getCompteByClerkId = asyncHandler(async (req, res, next) => {
  const comptes = await db.compte.findUnique({
    where: {
      clerkId: req.params.clerkId,
    },
    include: {
      patient: true,
    },
  });
  res.status(200).json(comptes);
});

const deleteAnCompte = asyncHandler(async (req, res, next) => {
  const id = req.params.id;
  const compte = await db.compte.delete({
    where: {
      id_compte: id,
    },
  });
  res.status(200).json({ message: "Compte supprimer avec succès", compte });
});

export {
  createCompteDentiste,
  createCompteDentisteIntervenant,
  createComptePatient,
  getAllCompte,
  getCompteByClerkId,
  deleteAnCompte,
};
