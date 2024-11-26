import db from "../config/db.js";
import asyncHandler from "express-async-handler";

// Récupérer tous les dentistes
const getDentiste = asyncHandler(async (req, res, next) => {
  const result = await db.dentiste.findMany();
  res.status(200).json(result);
});

// Récupérer un dentiste par ID
const getDentisteById = asyncHandler(async (req, res, next) => {
  const id_dentiste = req.params.id_dentiste;
  const result = await db.dentiste.findUnique({
    where: {
      id_dentiste: id_dentiste,
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
  req.io.emit("createDentiste", result);

  res.status(201).json({
    message: "Dentiste créé avec succès",
    dentiste: result,
  });
});

// Mettre à jour un dentiste existant
const updateDentiste = asyncHandler(async (req, res, next) => {
  const id_dentiste = req.params.id_dentiste;
  const body = req.body;

  const result = await db.dentiste.update({
    where: {
      id_dentiste: id_dentiste,
    },
    data: {
      ...body,
    },
  });
  req.io.emit("updateDentiste", result);

  res.status(200).json({
    message: "Dentiste mis à jour avec succès",
    dentiste: result,
  });
});

// Supprimer un dentiste
const deleteDentiste = asyncHandler(async (req, res, next) => {
  const id_dentiste = req.params.id_dentiste;

  const result = await db.dentiste.delete({
    where: {
      id_dentiste: id_dentiste,
    },
  });
  req.io.emit("deleteDentiste", result);


  res.status(200).json({
    message: "Dentiste supprimé avec succès",
    dentiste: result,
  });
});

const checkCode = asyncHandler(async (req, res, next) => {
  const {code} = req.body;

  const dentiste = await db.dentiste.findUnique({
    where: {
      numIns: code,
    },
    include: { compte: true },
  });
  if(!dentiste) {
    return res.status(404).json({message: "Aucun dentiste trouvée"});
  };
  if(dentiste.account) {
    return res.status(400).json({message: "Ce dentiste a déja un compte"});
  }
    res.status(200).json({ success: true });
})

export {
  getDentiste,
  getDentisteById,
  createDentiste,
  updateDentiste,
  deleteDentiste,
  checkCode
};
