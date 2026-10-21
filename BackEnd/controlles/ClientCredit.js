import mongoose from "mongoose";
import AdminModel from "../models/AdminModel.js";
import EmployeModel from "../models/EmployeModele.js";
import Client from "../models/Client.js";
import { clientCreditInvoices, invoiceCreditSummaries } from "../utils/clientInvoiceCredit.js";
import { creditError, summarizeInvoiceCredit, validateInvoiceCreditPayment } from "../../shared/invoiceCredit.js";

async function ownerFor(req) {
  if (req.user?.role !== "admin") throw creditError("creditForbidden", 403);
  const actor = await AdminModel.findById(req.user.id).select("_id");
  if (!actor) throw creditError("creditForbidden", 403);
  return actor._id;
}
async function clientFor(req, owner) {
  if (!mongoose.isObjectIdOrHexString(req.params.id)) throw creditError("creditNotFound", 404);
  const client = await Client.findOne({ _id: req.params.id, idAdmin: owner }).lean();
  if (!client) throw creditError("creditNotFound", 404);
  return client;
}
async function details(owner, client) {
  const invoices = await clientCreditInvoices(owner, client._id);
  return { client, invoices, summary: summarizeInvoiceCredit(invoices) };
}
const sendError = (res, error, fallback = "creditLoadFailed") => res.status(error.status || 500).json({ message: error.status ? error.message : fallback });

export async function getClientCreditSummaries(req, res) {
  try { res.json(await invoiceCreditSummaries(await ownerFor(req))); } catch (error) { sendError(res, error); }
}
export async function getClientCredit(req, res) {
  try { const owner = await ownerFor(req); res.json(await details(owner, await clientFor(req, owner))); } catch (error) { sendError(res, error); }
}
async function findInvoice(owner, clientId, invoiceId) {
  const match = { _id: invoiceId, clientId, isCredit: true };
  for (const [Model, scope] of [[AdminModel, { _id: owner }], [EmployeModel, { idAdmin: owner }]]) {
    const actor = await Model.findOne({ ...scope, Facture: { $elemMatch: match } }).select("_id Facture").lean();
    const invoice = actor?.Facture.find((item) => String(item._id) === invoiceId && String(item.clientId) === String(clientId) && item.isCredit);
    if (invoice) return { Model, filter: { ...scope, _id: actor._id }, invoice, match };
  }
  throw creditError("creditNotFound", 404);
}
export async function addClientCreditPayment(req, res) {
  try {
    const owner = await ownerFor(req), client = await clientFor(req, owner);
    if (!mongoose.isObjectIdOrHexString(req.params.invoiceId)) throw creditError("creditNotFound", 404);
    const input = { note: "", ...req.body };
    const found = await findInvoice(owner, client._id, req.params.invoiceId);
    const payment = validateInvoiceCreditPayment(found.invoice, input);
    if (!payment.duplicate) {
      const updated = await found.Model.findOneAndUpdate({ ...found.filter,
        Facture: { $elemMatch: { ...found.match, creditPaidCents: found.invoice.creditPaidCents, "creditPayments.requestId": { $ne: input.requestId } } },
      }, { $set: { "Facture.$.creditPaidCents": payment.paidCents, "Facture.$.amountPaid": payment.paidCents / 100 },
        $push: { "Facture.$.creditPayments": payment.payment },
      }, { new: true, runValidators: true });
      if (!updated) {
        const current = await findInvoice(owner, client._id, req.params.invoiceId);
        if (!validateInvoiceCreditPayment(current.invoice, input).duplicate) throw creditError("creditPaymentConflict", 409);
      }
    }
    res.json(await details(owner, client));
  } catch (error) { sendError(res, error, "creditSaveFailed"); }
}
