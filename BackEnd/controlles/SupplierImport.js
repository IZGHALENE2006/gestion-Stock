import { createHash, randomUUID } from "node:crypto";
import mongoose from "mongoose";
import AdminModel from "../models/AdminModel.js";
import FournisseurModel from "../models/Fournisseur.js";
import { planSupplierImport, planSupplierInvoiceImport, supplierCodeKey, supplierFingerprint } from "../../shared/supplierImport.js";

const fail = (message, status = 400, details = {}) => Object.assign(new Error(message), { status, ...details });
async function ownerFor(req) {
  if (req.user?.role !== "admin") throw fail("forbidden", 403);
  const actor = await AdminModel.findById(req.user.id).select("_id");
  if (!actor) throw fail("forbidden", 403);
  return String(actor._id);
}
function validatePlan(plan) {
  if (plan.errorCount) throw fail("invalidRows", 400, { rows: plan.rows.filter((row) => row.errors.length).map(({ rowNumber, errors }) => ({ rowNumber, errors })) });
}
function sendError(res, error) {
  const validation = ["emptyFile", "tooManyRows"].includes(error.message);
  return res.status(error.status || (validation ? 400 : 500)).json({ message: error.status || validation ? error.message : "importFailed", ...(error.rows ? { rows: error.rows } : {}) });
}

export async function importSuppliers(req, res) {
  try {
    const owner = await ownerFor(req);
    validatePlan(planSupplierImport(req.body?.rows));
    const existing = await FournisseurModel.find({ idAdmin: owner }).select("name phone email Ville externalCode").lean();
    const plan = planSupplierImport(req.body.rows, existing);
    const pending = plan.rows.filter((row) => !row.duplicate);
    const result = { created: 0, skipped: plan.duplicateCount };
    if (!pending.length) return res.status(201).json(result);
    await FournisseurModel.init();
    for (const [index, { data, rowNumber }] of pending.entries()) {
      const fingerprint = createHash("sha256").update(supplierFingerprint(data)).digest("hex");
      const code = supplierCodeKey(data);
      try {
        try {
          await FournisseurModel.create({ ...data, idAdmin: owner, importFingerprintKey: fingerprint, ...(code ? { importCodeKey: code } : {}) });
          result.created++;
        } catch (error) {
          if (error.code !== 11000) throw error;
          const duplicate = await FournisseurModel.findOne({ idAdmin: owner, $or: [{ importFingerprintKey: fingerprint }, ...(code ? [{ importCodeKey: code }] : [])] }).select("_id");
          if (!duplicate) throw error;
          result.skipped++;
        }
      } catch {
        return res.json({ ...result, failedRow: rowNumber, remaining: pending.length - index, failureCode: "importFailed" });
      }
    }
    return res.status(201).json(result);
  } catch (error) { return sendError(res, error); }
}

export async function importSupplierInvoices(req, res) {
  try {
    const owner = await ownerFor(req);
    if (!mongoose.isObjectIdOrHexString(req.params.id)) throw fail("notFound", 404);
    const filter = { _id: req.params.id, idAdmin: owner };
    const supplier = await FournisseurModel.findOne(filter).lean();
    if (!supplier) throw fail("notFound", 404);
    const plan = planSupplierInvoiceImport(req.body?.rows, supplier, supplier.invoices || []);
    validatePlan(plan);
    const result = { created: plan.createCount, skipped: plan.duplicateCount };
    if (!plan.createCount) return res.status(201).json(result);
    const invoices = plan.documents.map((document) => {
      const requestId = randomUUID();
      return { _id: new mongoose.Types.ObjectId(), requestId, reference: document.reference,
        invoiceDate: document.invoiceDate, supplierName: supplier.name, items: document.items,
        total: document.total, amountPaid: document.amountPaid,
        payments: document.amountPaid > 0 ? [{ requestId: `${requestId}-initial`, amount: document.amountPaid, date: document.invoiceDate, note: "" }] : [],
      };
    });
    // All invoice lines and payments are saved in one supplier document. No stock writes.
    const saved = await FournisseurModel.findOneAndUpdate({ ...filter,
      "invoices.reference": { $nin: invoices.map((invoice) => invoice.reference) },
    }, { $push: { invoices: { $each: invoices } } }, { new: true, runValidators: true });
    if (!saved) throw fail("importConflict", 409);
    return res.status(201).json(result);
  } catch (error) { return sendError(res, error); }
}
