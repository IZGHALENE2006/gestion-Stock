import express from 'express'
import { AddEmploye,LoginEmploye,AllEmploye } from '../controlles/Employe.js'
import { auth } from '../middleware/auth.js'
const router = express.Router()

router.post('/add',auth,AddEmploye)
router.post('/Login',auth,LoginEmploye)
router.get('/get',auth,AllEmploye)

export default router