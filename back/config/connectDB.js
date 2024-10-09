import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const mongo_url = process.env.DATABASE_URL; // Assure-toi que cette variable est définie dans ton .env

const connectDB = async () => {
  try {
    await mongoose.connect(mongo_url);
    console.log("MongoDB connecté...");
  } catch (err) {
    console.log("Erreur de connexion à MongoDB :", err);
  }
};

export default connectDB;
