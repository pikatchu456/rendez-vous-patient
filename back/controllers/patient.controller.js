import db from "../config/db.js";
import asyncHandler from "express-async-handler";

// Récupérer tous les patients
const getPatient = asyncHandler(async (req, res, next) => {
  const result = await db.patient.findMany();
  res.status(200).json(result);
});

// Récupérer un patient par ID
const getPatientById = asyncHandler(async (req, res, next) => {
  const id_patient = req.params.id_patient;
  const result = await db.patient.findUnique({
    where: {
      id_patient: id_patient,
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
  req.io.emit("createPatient", result);

  res.status(201).json({
    message: "Patient créé avec succès",
    patient: result,
  });
});

// Mettre à jour un patient existant
const updatePatient = asyncHandler(async (req, res, next) => {
  const id_patient = req.params.id_patient;
  const body = req.body;

  const result = await db.patient.update({
    where: {
      id_patient: id_patient,
    },
    data: {
      ...body,
    },
  });
  req.io.emit("updatePatient", result);

  res.status(200).json({
    message: "Patient mis à jour avec succès",
    patient: result,
  });
});

// Supprimer un patient
const deletePatient = asyncHandler(async (req, res, next) => {
  const id_patient = req.params.id_patient;

  const result = await db.patient.delete({
    where: {
      id_patient: id_patient,
    },
  });
   req.io.emit("deletePatient", result);

  res.status(200).json({
    message: "Patient supprimé avec succès",
    patient: result,
  });
});

const createAccount = asyncHandler(async (req, res, next) => {
  const { email } = req.body;
  // Vérifier si l'email correspond à un patient sans compte
  const patient = await db.patient.findUnique({
    where: { email },
    include: { compte: true },
  });

  // Vérifier si le patient a déjà un compte
  if (patient && patient.compte) {
    return res.status(400).json({
      message: "Cet email appartient déjà à un patient avec un compte.",
    });
  }

  if (patient) {
    // Créer un compte patient
    const newCompte = await db.compte.create({
      data: {
        ...req.body,
        role: "DENTISTE", // Définir le rôle comme patient
        patient: { connect: { id_patient: patient.id_patient } },
      },
    });

    return res
      .status(201)
      .json({ message: "Compte patient créé.", compte: newCompte });
  }

  // Si l'email n'appartient pas à un patient, créer un compte patient par défaut
  const newComptePatient = await db.compte.create({
    data: {
      ...req.body, // Rôle par défaut : patient (le modèle prévoit un rôle par défaut PATIENT)
    },
  });

  res
    .status(201)
    .json({ message: "Compte patient créé.", compte: newComptePatient });
});

const checkCode = asyncHandler(async (req, res, next) => {
  const { code } = req.body;

  const patient = await db.patient.findUnique({
    where: {
      numIns: code,
    },
    include: { compte: true },
  });
  if (!patient) {
    return res.status(404).json({ message: "Aucun patient trouvée" });
  }
  if (patient.account) {
    return res.status(400).json({ message: "Ce patient a déja un compte" });
  }
  res.status(200).json({ success: true });
});


export {
  getPatient,
  getPatientById,
  createPatient,
  updatePatient,
  deletePatient,
  createAccount,
  checkCode
};
