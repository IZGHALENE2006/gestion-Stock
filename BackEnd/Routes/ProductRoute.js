import express from 'express'
import { CreateProduct,AllProduct ,DeleteProduct,UpdateProduit} from '../controlles/Product.js'

import { auth } from "../middleware/auth.js";
import { onlyAdmin } from '../middleware/authorize.js';
import { uploadProductImage } from '../middleware/productUpload.js';
import { importProducts } from '../controlles/ProductImport.js';
const router = express.Router()

router.get('/Get',auth,AllProduct)
router.post('/Add',auth,onlyAdmin,uploadProductImage,CreateProduct)
router.post('/Import',auth,onlyAdmin,importProducts)
router.delete('/Delete/:id',auth,onlyAdmin,DeleteProduct)
router.put('/Update/:id',auth,onlyAdmin,uploadProductImage,UpdateProduit)
export default router
