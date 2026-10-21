import { normalizeImportText, parseImportNumber } from "./productImport.js";
import { calculateSupplierInvoice, supplierDate } from "./supplierInvoices.js";
import { roundMoney } from "./saleTotals.js";

export const SUPPLIER_IMPORT_MAX_ROWS = 2000;
export const SUPPLIER_IMPORT_MAX_BYTES = 5 * 1024 * 1024;
export const supplierImportFields = {
  suppliers: ["externalCode", "name", "phone", "email", "Ville"],
  invoices: ["reference", "invoiceDate", "name", "quantity", "unitPrice", "amountPaid", "total", "remaining", "supplierName", "supplierId"],
};
export const supplierImportHeaders = {
  suppliers: ["Code fournisseur", "Nom", "Téléphone", "Email", "Ville"],
  invoices: ["Référence facture", "Date", "Produit", "Quantité", "Prix achat", "Montant payé", "Total facture", "Reste à payer", "Fournisseur", "ID fournisseur"],
};
const aliases = {
  externalCode: ["code fournisseur", "code tiers", "code", "reference fournisseur"],
  name: ["nom", "nom fournisseur", "raison sociale", "fournisseur"],
  phone: ["telephone", "tel", "telephone mobile", "portable", "phone"],
  email: ["email", "e mail", "mail", "adresse email"],
  Ville: ["ville", "localite", "city"],
  reference: ["reference facture", "reference", "numero facture", "n facture", "numero de facture", "facture", "numero de piece", "n piece"],
  invoiceDate: ["date", "date facture", "date de facture", "date de piece"],
  quantity: ["quantite", "qte"],
  unitPrice: ["prix achat", "prix dachat", "prix unitaire", "pu", "pu ht"],
  amountPaid: ["montant paye", "paye", "montant regle", "deja regle", "acompte"],
  total: ["total facture", "montant facture", "total ttc"],
  remaining: ["reste a payer", "restant", "reste", "solde"],
  supplierName: ["fournisseur", "nom fournisseur", "raison sociale fournisseur"],
  supplierId: ["id fournisseur", "identifiant fournisseur"],
};
const columnAliases = (key, kind) => kind === "invoices" && key === "name" ? ["produit", "article", "libelle", "designation", "nom produit"] : aliases[key];
export function supplierImportColumns(headers, kind) {
  const normalized = headers.map(normalizeImportText);
  return Object.fromEntries(supplierImportFields[kind].map((key) => {
    const names = columnAliases(key, kind);
    return [key, normalized.findIndex((name) => names.includes(name))];
  }));
}
export function mapSupplierSheet(sheet, kind) {
  const columns = supplierImportColumns(sheet.headers, kind);
  const normalized = sheet.headers.map(normalizeImportText);
  const ambiguous = supplierImportFields[kind].filter((key) => normalized.filter((name) => columnAliases(key, kind).includes(name)).length > 1);
  if (ambiguous.length) throw Object.assign(new Error("ambiguousColumns"), { fields: ambiguous });
  const required = kind === "suppliers" ? ["name"] : ["reference", "invoiceDate", "name", "quantity", "unitPrice"];
  const missing = required.filter((key) => columns[key] < 0);
  if (missing.length) throw Object.assign(new Error("missingColumns"), { fields: missing });
  return sheet.rows.map(({ rowNumber, cells }) => ({ rowNumber, ...Object.fromEntries(Object.entries(columns).map(([key, index]) => [key, index < 0 ? "" : cells[index] ?? ""])) }));
}
const fail = (message) => { throw new Error(message); };
const blank = (value) => value == null || value === "" || (typeof value === "string" && !value.trim());
function text(value, max, required = false) {
  if (value?.formula) return fail("formula");
  if (blank(value)) return required ? fail("required") : "";
  if (!["string", "number"].includes(typeof value) || (typeof value === "number" && !Number.isSafeInteger(value))) return fail("invalidText");
  const result = String(value).trim();
  if (result.length > max || [...result].some((char) => char.charCodeAt(0) < 32)) return fail("invalidText");
  return result;
}
function amount(value) {
  if (value?.formula) return fail("formula");
  return parseImportNumber(value);
}
function date(value) {
  const raw = text(value, 10, true);
  const match = /^(\d{2})[/.](\d{2})[/.](\d{4})$/.exec(raw);
  return supplierDate(match ? `${match[3]}-${match[2]}-${match[1]}` : raw);
}
const identityText = (value) => String(value || "").normalize("NFC").trim().toLocaleLowerCase().replace(/\s+/g, " ");
export const supplierCodeKey = (supplier) => identityText(supplier.externalCode);
export const supplierFingerprint = (supplier) => JSON.stringify([
  identityText(supplier.name), String(supplier.phone || "").replace(/[^\d+]/g, ""),
  identityText(supplier.email), identityText(supplier.Ville),
]);
function records(input) {
  if (!Array.isArray(input) || !input.length) return fail("emptyFile");
  if (input.length > SUPPLIER_IMPORT_MAX_ROWS) return fail("tooManyRows");
  return input.map((row, index) => ({ input: row || {}, rowNumber: Number.isSafeInteger(row?.rowNumber) && row.rowNumber > 0 ? row.rowNumber : index + 2, data: {}, errors: [], duplicate: "" }));
}
function readField(row, key, parse) {
  try { row.data[key] = parse(row.input[key]); } catch (error) { row.errors.push({ field: key, code: error.message }); }
}
const result = (rows, createCount, duplicateCount, documents) => ({ rows: rows.map(({ rowNumber, data, errors, duplicate }) => ({ rowNumber, data, errors, duplicate })), createCount, duplicateCount, errorCount: rows.filter((row) => row.errors.length).length, ...(documents ? { documents } : {}) });

export function planSupplierImport(input, suppliers = []) {
  const rows = records(input);
  const codes = new Set(suppliers.map(supplierCodeKey).filter(Boolean)), fingerprints = new Set(suppliers.map(supplierFingerprint));
  const fileCodes = new Set(), fileFingerprints = new Set();
  for (const row of rows) {
    readField(row, "name", (value) => text(value, 200, true));
    readField(row, "externalCode", (value) => text(value, 80));
    readField(row, "Ville", (value) => text(value, 120));
    readField(row, "email", (value) => { const email = text(value, 254).toLowerCase(); if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) fail("invalidEmail"); return email; });
    readField(row, "phone", (value) => { const phone = text(value, 40); if (phone && (!/^[+\d\s().-]+$/.test(phone) || !/^\d{6,20}$/.test(phone.replace(/\D/g, "")))) fail("invalidPhone"); return phone; });
    if (row.errors.length) continue;
    const code = supplierCodeKey(row.data), fingerprint = supplierFingerprint(row.data);
    row.duplicate = (code && codes.has(code)) || fingerprints.has(fingerprint) ? "existing" : (code && fileCodes.has(code)) || fileFingerprints.has(fingerprint) ? "file" : "";
    if (code) fileCodes.add(code);
    fileFingerprints.add(fingerprint);
  }
  return result(rows, rows.filter((row) => !row.errors.length && !row.duplicate).length, rows.filter((row) => row.duplicate).length);
}

export function planSupplierInvoiceImport(input, supplier, existing = []) {
  const rows = records(input), groups = new Map(), references = new Set(existing.map((invoice) => invoice.reference).filter(Boolean));
  for (const row of rows) {
    readField(row, "reference", (value) => text(value, 80, true));
    readField(row, "name", (value) => text(value, 200, true));
    readField(row, "quantity", amount);
    readField(row, "unitPrice", (value) => roundMoney(amount(value)));
    readField(row, "invoiceDate", (value) => blank(value) ? "" : date(value));
    for (const key of ["amountPaid", "total", "remaining"]) readField(row, key, (value) => blank(value) ? null : roundMoney(amount(value)));
    readField(row, "supplierName", (value) => { const name = text(value, 200); if (name && identityText(name) !== identityText(supplier?.name)) fail("wrongSupplier"); return name; });
    readField(row, "supplierId", (value) => { const id = text(value, 80); if (id && id !== String(supplier?._id)) fail("wrongSupplier"); return id; });
    if (!row.errors.some((error) => ["name", "quantity", "unitPrice"].includes(error.field))) {
      try { calculateSupplierInvoice([{ name: row.data.name, quantity: row.data.quantity, unitPrice: row.data.unitPrice }]); }
      catch (error) { row.errors.push({ field: error.message === "invalidQuantity" ? "quantity" : "unitPrice", code: error.message }); }
    }
    if (!row.data.reference) continue;
    if (!groups.has(row.data.reference)) groups.set(row.data.reference, []);
    groups.get(row.data.reference).push(row);
  }
  const documents = [];
  let skipped = 0;
  for (const [reference, group] of groups) {
    const first = group[0];
    const values = {};
    for (const key of ["invoiceDate", "amountPaid", "total", "remaining"]) {
      const distinct = [...new Set(group.map((row) => row.data[key]).filter((value) => value != null && value !== ""))];
      if (distinct.length > 1) first.errors.push({ field: key, code: "inconsistentInvoice" });
      values[key] = distinct[0];
    }
    if (!values.invoiceDate) first.errors.push({ field: "invoiceDate", code: "required" });
    if (references.has(reference)) { group.forEach((row) => { row.duplicate = "existing"; }); skipped++; }
    if (group.some((row) => row.errors.length)) continue;
    try {
      const totals = calculateSupplierInvoice(group.map((row) => ({ name: row.data.name, quantity: row.data.quantity, unitPrice: row.data.unitPrice })), values.amountPaid ?? 0);
      for (const key of ["total", "remaining"]) if (values[key] !== undefined && values[key] !== totals[key]) first.errors.push({ field: key, code: "totalMismatch" });
      if (!first.errors.length && !first.duplicate) documents.push({ reference, invoiceDate: values.invoiceDate, ...totals, rowNumber: first.rowNumber });
    } catch (error) { first.errors.push({ field: error.message === "overpayment" ? "amountPaid" : "total", code: error.message }); }
  }
  return result(rows, documents.length, skipped, documents);
}
