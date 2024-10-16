import express from "express";
import dotenv from "dotenv";
import dentiste_router from "./back/routes/dentiste.route.js";
import planification_router from "./back/routes/planification.route.js";
import patient_router from "./back/routes/patient.route.js";
import consultation_router from "./back/routes/consultation.route.js";
import compte_router from "./back/routes/compte.route.js";
import cors from "cors";
import axios from "axios";
import { google } from "googleapis";
import connectDB from "./back/config/connectDB.js"; // Assure-toi que ce chemin est correct

dotenv.config();

// Connexion à MongoDB
connectDB();

const app = express();
/*
const scopes = [
  'https://www.googleapis.com/auth/calendar'
];

const auth2Clinet = new google.auth.OAuth2(
    process.env.CLIENT_ID,
    process.env.CLIENT_SECRET,
    process.env.REDIRECT_URL,
)*/

const PORT = process.env.PORT || 3000;
//app.use(cors({ origin: "http://localhost:3000" })); // Autorise le frontend (React) à faire des requêtes
app.use(express.json());

app.use(express.json());
app.use("/api/compte", compte_router);
app.use("/api/consultation", consultation_router);
app.use("/api/patient", patient_router);
app.use("/api/planification", planification_router);
app.use("/api/dentiste", dentiste_router);
/*app.get("/api/google", (req, res) => {
    const url = auth2Clinet.generateAuthUrl({
      access_type: "offline",
      scope: scopes
    });
    res.redirect(url);
});
app.get("/api/google/redirect", (req, res) => {
  const code = req.query.code;
  const {data} = await auth2Clinet.getToken(code);
  res.send("api calendar marche");
});*/
app.listen(PORT, console.log("Démarrage du serveur", PORT));
