import { Router } from "express";

import {
  getPatient,
  getPatientById,
  createPatient,
  updatePatient,
  deletePatient,
} from "../controllers/patient.controller.js";

const patient_router = Router();

patient_router.get("/", getPatient).post("/", createPatient);

patient_router
  .get("/:id", getPatientById)
  .put("/:id", updatePatient)
  .delete("/:id", deletePatient);

export default patient_router;
