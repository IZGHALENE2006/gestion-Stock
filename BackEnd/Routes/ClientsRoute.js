import express from "express";
import { auth } from "../middleware/auth.js";
import { listClients, addClient, updateClient } from "../controlles/Clients.js";
import { getClientCredit, getClientCreditSummaries, addClientCreditPayment } from "../controlles/ClientCredit.js";

const router = express.Router();
router.use(auth);
router.get("/", listClients);
router.get("/credit-summary", getClientCreditSummaries);
router.get("/:id/credit", getClientCredit);
router.post("/:id/credit/:invoiceId/payments", addClientCreditPayment);
router.post("/", addClient);
router.put("/:id", updateClient);
export default router;
