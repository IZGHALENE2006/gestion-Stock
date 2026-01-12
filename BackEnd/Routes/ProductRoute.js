import express from 'express'
import { CreateProduct,AllProduct ,DeleteProduct} from '../controlles/Product.js'

import { auth } from "../middleware/auth.js";

const router = express.Router()

router.get('/Get',auth,AllProduct)
router.post('/Add',auth,CreateProduct)
router.delete('/Delete/:id',auth,DeleteProduct)
export default router