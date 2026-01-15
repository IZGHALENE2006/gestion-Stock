import express from 'express'
import { CreateProduct,AllProduct ,DeleteProduct,UpdateProduit} from '../controlles/Product.js'

import { auth } from "../middleware/auth.js";
import { onlyAdmin } from '../middleware/authorize.js';
const router = express.Router()

router.get('/Get',auth,AllProduct)
router.post('/Add',auth,onlyAdmin,CreateProduct)
router.delete('/Delete/:id',auth,onlyAdmin,DeleteProduct)
router.put('/Update/:id',auth,onlyAdmin,UpdateProduit)    
export default router   