import express from "express"
import dotenv from "dotenv"
import dentiste_router from "./back/routes/dentiste.route.js"
import planification_router from "./back/routes/planification.route.js"
import patient_router from "./back/routes/patient.route.js"
import consultation_router from "./back/routes/consultation.route.js"
import compte_router from "./back/routes/compte.route.js"

dotenv.config()

const app = express()

const PORT = process.env.PORT || 6000;

app.use(express.json())
app.use("/compte", compte_router);
app.use("/consultation", consultation_router);
app.use("/patient", patient_router);
app.use("/planification", planification_router);
app.use("/dentiste", dentiste_router)
app.listen(PORT, console.log("Démarrage du serveur", PORT))