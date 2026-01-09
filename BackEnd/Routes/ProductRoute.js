import express from 'express'
import { CreateProduct,AllProduct } from '../controlles/Product.js'

import { auth } from "../middleware/auth.js";

const router = express.Router()

router.get('/Get',auth,AllProduct)
router.post('/Add',auth,CreateProduct)
export default router