import express from "express";
import { CreatAdmin } from "../controlles/Admin.js";

const router = express.Router();

router.post("/", CreatAdmin);

export default router;
