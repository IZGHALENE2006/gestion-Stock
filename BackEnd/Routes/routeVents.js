import express from 'express'
import { AddVente } from '../controlles/Ventes.js';
import { auth } from "../middleware/auth.js";
const router = express.Router()

router.post('/',auth,AddVente)

export default router   