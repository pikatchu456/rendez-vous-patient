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

const createAccount = asyncHandler(async (req, res, next) => {
  const { email } = req.body;
  // Vérifier si l'email correspond à un dentiste sans compte
  const dentiste = await db.dentiste.findUnique({
    where: { email },
    include: { compte: true },
  });

  // Vérifier si le dentiste a déjà un compte
  if (dentiste && dentiste.compte) {
    return res.status(400).json({
      message: "Cet email appartient déjà à un dentiste avec un compte.",
    });
  }

  if (dentiste) {
    // Créer un compte dentiste
    const newCompte = await db.compte.create({
      data: {
        ...req.body,
        role: "DENTISTE", // Définir le rôle comme dentiste
        dentiste: { connect: { id_dentiste: dentiste.id_dentiste } },
      },
    });

    return res
      .status(201)
      .json({ message: "Compte dentiste créé.", compte: newCompte });
  }

  // Si l'email n'appartient pas à un dentiste, créer un compte patient par défaut
  const newComptePatient = await db.compte.create({
    data: {
      ...req.body, // Rôle par défaut : patient (le modèle prévoit un rôle par défaut PATIENT)
    },
  });

  res
    .status(201)
    .json({ message: "Compte patient créé.", compte: newComptePatient });
});

export {
  getPatient,
  getPatientById,
  createPatient,
  updatePatient,
  deletePatient,
  createAccount,
};
