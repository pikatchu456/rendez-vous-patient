import { Router } from "express";

import { getDentiste, getDentisteById, createDentiste, updateDentiste, deleteDentiste } from "../controllers/dentiste.controller.js";

const dentiste_router = Router()

dentiste_router.get("/", getDentiste).post("/", createDentiste);

dentiste_router
  .get("/:id_dentiste", getDentisteById)
  .put("/:id_dentiste", updateDentiste)
  .delete("/:id_dentiste", deleteDentiste);

  export default dentiste_router
