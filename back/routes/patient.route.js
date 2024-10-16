import { Router } from "express";

import {
  getPatient,
  getPatientById,
  createPatient,
  updatePatient,
  deletePatient,
  createAccount
} from "../controllers/patient.controller.js";

const patient_router = Router();

patient_router.get("/", getPatient).post("/", createPatient);

patient_router.post(
  "/checkCode",
  createAccount
);

patient_router
  .get("/:id_patient", getPatientById)
  .put("/:id_patient", updatePatient)
  .delete("/:id_patient", deletePatient);

export default patient_router;
