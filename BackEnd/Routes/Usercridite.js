import express from 'express'
import { auth } from '../middleware/auth.js'
import { onlyAdmin } from '../middleware/authorize.js'
import {
  AddUserCridite,
  AllUserCridite,
  GetUserCriditeById,
  AddCreditProduct,
  AddUserPayment,
  DeleteCreditProduct,
  DeleteUsercridite,
} from '../controlles/UserCridite.js'
const router = express.Router()

router.post('/add', auth, onlyAdmin, AddUserCridite)
router.get('/get', auth, onlyAdmin, AllUserCridite)
router.get('/get/:id', auth, onlyAdmin, GetUserCriditeById)
router.post('/add-product/:id', auth, onlyAdmin, AddCreditProduct)
router.post('/add-payment/:id', auth, onlyAdmin, AddUserPayment)
router.delete('/DeleteProduct/:id/:productId', auth, onlyAdmin, DeleteCreditProduct)
router.delete('/Delete/:id', auth, onlyAdmin, DeleteUsercridite)

export default router
