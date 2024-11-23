import express from "express";
import { Router } from "express";
import { generatePDF } from "../controllers/pdf.controller.js";

const pdf_router = Router();

pdf_router.get("/pdf/:id_consultation", generatePDF);

export default pdf_router;
