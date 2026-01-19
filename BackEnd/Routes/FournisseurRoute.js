import {
  AddFournisseur,
  GetFournisseur,
  DeleteFournisseur,
  UpdateFournisseur,
} from "../controlles/Fournisseur.js";

import { auth } from "../middleware/auth.js";
import express from "express";

const router = express.Router();

router.post("/Add", auth, AddFournisseur);
router.get("/Get", auth, GetFournisseur);
router.delete("/Delete/:id", auth, DeleteFournisseur);
router.patch("/Update/:id", auth, UpdateFournisseur);

export default router;
