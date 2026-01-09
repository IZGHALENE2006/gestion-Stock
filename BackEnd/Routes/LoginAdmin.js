import { LoginAdmin,getAdminFromToken,CreatAdmin} from "../controlles/Admin.js";
import express from 'express'
import { auth } from "../middleware/auth.js";

const router = express.Router()

router.post("/register", CreatAdmin);
router.post("/Login",LoginAdmin)
router.get('/GetAdmin',auth,getAdminFromToken)
export default router
