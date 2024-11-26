import { Router } from "express";

import {
  getConsultation,
  getConsultationById,
  createConsultation,
  updateConsultation,
  deleteConsultation,
  generateConsultationPDF,
} from "../controllers/consultation.controller.js";

const consultation_router = Router();

consultation_router.get("/", getConsultation).post("/", createConsultation);

consultation_router
  .get("/:id_consultation", getConsultationById)
  .put("/:id_consultation", updateConsultation)
  .delete("/:id_consultation", deleteConsultation)
  .get("/pdf/:id_consultation", generateConsultationPDF);

export default consultation_router;
