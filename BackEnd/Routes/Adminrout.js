import express from "express";
import { CreatAdmin ,LoginAdmin} from "../controlles/Admin.js";

const router = express.Router();

router.post("/", CreatAdmin);


export default router;
