import { Router } from "express";

import {
  getPlanification,
  getPlanificationById,
  createPlanification,
  updatePlanification,
  deletePlanification,
} from "../controllers/planification.controller.js";

const planification_router = Router();

planification_router.get("/", getPlanification).post("/", createPlanification);

planification_router
  .get("/:id_planification", getPlanificationById)
  .put("/:id_planification", updatePlanification)
  .delete("/:id_planification", deletePlanification);

export default planification_router;
