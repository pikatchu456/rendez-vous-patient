import db from "../config/db.js";
import asyncHandler from "express-async-handler";

const getAllCompte = asyncHandler(async (req, res, next) => {
  const comptes = await db.compte.findMany({
    include: {
      patient: true,
    },
  });
  res.status(200).json(comptes);
});

const createCompteDentisteIntervenant = asyncHandler(async (req, res) => {
  const compte = await db.compte.create({
    data: {
      ...req.body,
      role: "DENTISTE_INTERVENANT",
    },
  });
  res
    .status(200)
    .json({ message: "Dentiste intervenant créer avec succès", compte });
});

const createCompteDentiste = asyncHandler(async (req, res, next) => {
  const compte = await db.compte.create({
    data: {
      ...req.body,
      role: "DENTISTE",
    },
  });
  res.status(200).json({ message: "Dentiste créer avec succès", compte });
});

const createComptePatient = asyncHandler(async (req, res, next) => {
  try {
    const compte = await db.compte.create({
      data: {
        ...req.body,
      },
    });
    res.status(200).json({ message: "Patient créé avec succès", compte });
  } catch (error) {
    console.error("Erreur lors de la création du compte patient :", error);
    res.status(500).json({ message: "Erreur interne du serveur" });
  }
});

const getCompteByClerkId = asyncHandler(async (req, res, next) => {
  const compte = await db.compte.findUnique({
    where: {
      clerkId: req.params.clerkId,
    },
    select: {
      id_compte: true,
      email: true,
      role: true,
      // Select only necessary fields
    },
  });

  if (!compte) {
    return res
      .status(404)
      .json({ message: "Aucun compte trouvé avec cet identifiant Clerk" });
  }

  res.status(200).json(compte);
});

const getCompteByUsernameOrEmail = asyncHandler(async (req, res) => {
  const { username, email } = req.body;

  if (!username && !email) {
    return res
      .status(400)
      .json({ message: "Nom d'utilisateur ou email requis" });
  }

  const compte = await db.compte.findFirst({
    where: {
      OR: [{ username: username || undefined }, { email: email || undefined }],
    },
    select: {
      id_compte: true,
      email: true,
      username: true,
      role: true,
    },
  });

  if (!compte) {
    return res
      .status(404)
      .json({ message: "Aucun compte trouvé avec ces identifiants" });
  }

  res.status(200).json(compte);
});

const deleteAnCompte = asyncHandler(async (req, res, next) => {
  const id_compte = req.params.id_compte;
  const compte = await db.compte.delete({
    where: {
      id_compte: id_compte,
    },
  });
  res.status(200).json({ message: "Compte supprimé avec succès", compte });
});

export {
  createCompteDentiste,
  createCompteDentisteIntervenant,
  createComptePatient,
  getAllCompte,
  getCompteByClerkId,
  deleteAnCompte,
  getCompteByUsernameOrEmail,
};
