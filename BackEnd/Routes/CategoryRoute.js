import { AddCategory,GetCategory } from "../controlles/Category.js";
import { auth } from "../middleware/auth.js";
import express from 'express'

const router = express.Router()

router.post('/Add',auth,AddCategory)
router.get('/Get',auth,GetCategory)
export default router