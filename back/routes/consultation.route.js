import { Router } from "express";

import {
  getConsultation,
  getConsultationById,
  createConsultation,
  updateConsultation,
  deleteConsultation,
} from "../controllers/consultation.controller.js";

const consultation_router = Router();

consultation_router.get("/", getConsultation).post("/", createConsultation);

consultation_router
  .get("/:id", getConsultationById)
  .put("/:id", updateConsultation)
  .delete("/:id", deleteConsultation);

export default consultation_router;
