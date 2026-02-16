import express from 'express'
import { auth } from '../middleware/auth.js'
import { AddUserCridite,AllUserCridite,DeleteUsercridite } from '../controlles/UserCridite.js'
const router = express.Router()

router.post('/add',auth,AddUserCridite)
router.get('/get',auth,AllUserCridite)
router.delete('/Delete/:id',auth,DeleteUsercridite)
// router.put('/Update/:id',auth,UpdateEmploye)

export default router