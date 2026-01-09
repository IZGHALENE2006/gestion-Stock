import { LoginAdmin} from "../controlles/Admin.js";
import express from 'express'
const router = express.Router()

router.post('/',LoginAdmin)
export default router
