import express from "express";
import dotenv from "dotenv";
import dentiste_router from "./back/routes/dentiste.route.js";
import planification_router from "./back/routes/planification.route.js";
import patient_router from "./back/routes/patient.route.js";
import consultation_router from "./back/routes/consultation.route.js";
import compte_router from "./back/routes/compte.route.js";
import pdf_router from "./back/routes/pdf.route.js";
import cors from "cors";
import axios from "axios";
import { google } from "googleapis";
import connectDB from "./back/config/connectDB.js";
import { ClerkExpressWithAuth } from "@clerk/clerk-sdk-node";

dotenv.config();

// Configure Clerk et le rend accessible globalement
const clerkMiddleware = ClerkExpressWithAuth({
  secretKey: process.env.CLERK_SECRET_KEY,
});

// Connexion à MongoDB
connectDB();

const app = express();

const PORT = process.env.PORT || 3000;
app.use(express.json());

app.use(express.json());
app.use("/api", pdf_router);
app.use("/api/compte", compte_router);
app.use("/api/consultation", consultation_router);
app.use("/api/patient", patient_router);
app.use("/api/planification", planification_router);
app.use("/api/dentiste", dentiste_router);

app.listen(PORT, console.log("Démarrage du serveur", PORT));
