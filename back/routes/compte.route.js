import { Router } from "express";

import {
  createCompteDentiste,
  createCompteDentisteIntervenant,
  createComptePatient,
  getAllCompte,
  getCompteByClerkId,
  deleteAnCompte,
  getCompteByUsernameOrEmail,
} from "../controllers/compte.controller.js";

const compte_router = Router();

compte_router
  .get("/", getAllCompte)
  .post("/dentiste", createCompteDentiste)
  .post("/role", getCompteByUsernameOrEmail)
  .post("/dentiste_intervenant", createCompteDentisteIntervenant)
  .post("/patient", createComptePatient);

compte_router
  .get("/clerk/:clerkId", getCompteByClerkId)
  .get("/:id_compte", getCompteByClerkId)
  .delete("/:id_compte", deleteAnCompte);

export default compte_router;
