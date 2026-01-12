import express from 'express'
import { CreateProduct,AllProduct ,DeleteProduct,UpdateProduit} from '../controlles/Product.js'

import { auth } from "../middleware/auth.js";

const router = express.Router()

router.get('/Get',auth,AllProduct)
router.post('/Add',auth,CreateProduct)
router.delete('/Delete/:id',auth,DeleteProduct)
router.put('/Update/:id',auth,UpdateProduit)    
export default router   