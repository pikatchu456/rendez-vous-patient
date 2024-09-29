import { Router } from "express";

import {
  createCompteDentiste,
  createCompteDentisteIntervenant,
  createComptePatient,
  getAllCompte,
  getCompteByClerkId,
  deleteAnCompte,
} from "../controllers/compte.controller.js";

const compte_router = Router();

compte_router
  .get("/", getAllCompte)
  .post("/dentiste", createCompteDentiste)
  .post("/dentiste_intervenant", createCompteDentisteIntervenant)
  .post("/patient", createComptePatient);

compte_router.get("/:id", getCompteByClerkId).delete("/:id", deleteAnCompte);

export default compte_router;
