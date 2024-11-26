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
import { Server } from "socket.io";
import http from "http";

dotenv.config();

// Configure Clerk et le rend accessible globalement
const clerkMiddleware = ClerkExpressWithAuth({
  secretKey: process.env.CLERK_SECRET_KEY,
});

// Connexion à MongoDB
connectDB();

const app = express();

// Créer le serveur HTTP
const server = http.createServer(app);

// Configurer Socket.IO
const io = new Server(server, {
  cors: {
    origin: "*", // Remplacez "*" par l'origine spécifique si nécessaire
    methods: ["GET", "POST"],
  },
});

// Gestion des connexions WebSocket
io.on("connection", (socket) => {
  console.log("Un utilisateur s'est connecté :", socket.id);

  // Exemple : Écouter un événement de consultation
  socket.on("newConsultation", (data) => {
    console.log("Nouvelle consultation créée :", data);

    // Émettre à tous les clients connectés
    io.emit("consultationAdded", data);
  });

  // Gestion de la déconnexion
  socket.on("disconnect", () => {
    console.log("Un utilisateur s'est déconnecté :", socket.id);
  });
});

const PORT = process.env.PORT || 3000;

// Middleware pour injecter `io` dans les requêtes
app.use((req, res, next) => {
  req.io = io;
  next();
});

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Déclaration des routes
app.use("/api", pdf_router);
app.use("/api/compte", compte_router);
app.use("/api/consultation", consultation_router);
app.use("/api/patient", patient_router);
app.use("/api/planification", planification_router);
app.use("/api/dentiste", dentiste_router);

// Lancer le serveur
server.listen(PORT, () => {
  console.log(`Démarrage du serveur sur le port ${PORT}`);
});
