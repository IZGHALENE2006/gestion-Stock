import test from "node:test";
import assert from "node:assert/strict";
import { utils, write } from "xlsx";
import { readSupplierWorkbook } from "../shared/supplierWorkbook.js";
import { mapSupplierSheet, planSupplierImport, planSupplierInvoiceImport, supplierImportHeaders, SUPPLIER_IMPORT_MAX_ROWS } from "../shared/supplierImport.js";

const supplier = { _id: "333333333333333333333333", name: "Fournisseur محمد" };
const input = { reference: "FA-001", invoiceDate: "13/10/2026", name: "دفتر", quantity: "2,5", unitPrice: "10,20 DH", amountPaid: "5,50" };
const bytes = (sheet, bookType = "xlsx", date1904 = false) => {
  const book = utils.book_new(); utils.book_append_sheet(book, sheet, "Données");
  if (date1904) book.Workbook = { WBProps: { date1904: true } };
  return write(book, { type: "array", bookType });
};
for (const format of ["xlsx", "xls"]) test(`${format} supplier import preserves Arabic, accents, optional fields and leading zeros`, () => {
  const worksheet = utils.aoa_to_sheet([supplierImportHeaders.suppliers, ["00017", "Société محمد", "0612345678", "contact@example.ma", "Fès"], ["", "Fournisseur B"]]);
  const [sheet] = readSupplierWorkbook(bytes(worksheet, format), "suppliers");
  const plan = planSupplierImport(mapSupplierSheet(sheet, "suppliers"));
  assert.equal(plan.errorCount, 0); assert.equal(plan.createCount, 2);
  assert.equal(plan.rows[0].data.externalCode, "00017"); assert.equal(plan.rows[0].data.phone, "0612345678");
  assert.equal(plan.rows[0].data.name, "Société محمد"); assert.equal(plan.rows[1].data.email, "");
});
test("supplier CSV and formatted numeric phones retain zeros and source line numbers", () => {
  const csv = "Code fournisseur;Nom;Téléphone;Email;Ville\n001;مورد;0612345678;;Fès";
  const [sheet] = readSupplierWorkbook(new TextEncoder().encode(csv), "suppliers");
  assert.equal(planSupplierImport(mapSupplierSheet(sheet, "suppliers")).rows[0].data.phone, "0612345678");
  const worksheet = utils.aoa_to_sheet([]);
  utils.sheet_add_aoa(worksheet, [supplierImportHeaders.suppliers, [17, "Supplier", 612345678, "", ""]], { origin: "C5" });
  worksheet.C6.z = "00000"; worksheet.E6.z = "0000000000";
  const row = planSupplierImport(mapSupplierSheet(readSupplierWorkbook(bytes(worksheet), "suppliers")[0], "suppliers")).rows[0];
  assert.equal(row.rowNumber, 6); assert.equal(row.data.externalCode, "00017"); assert.equal(row.data.phone, "0612345678");
});
test("supplier duplicates match external code or complete contact details without overwriting", () => {
  const existing = { externalCode: "F-01", name: "Atlas", phone: "06 12 34 56 78", email: "ATLAS@example.ma", Ville: "Fès" };
  const rows = [{ ...existing, externalCode: "f-01", name: "Changed" }, { ...existing, externalCode: "", phone: "0612345678" }, { name: "New" }, { name: " NEW " }];
  const plan = planSupplierImport(rows, [existing]);
  assert.equal(plan.createCount, 1); assert.equal(plan.duplicateCount, 3);
  assert.deepEqual(plan.rows.map((row) => row.duplicate), ["existing", "existing", "", "file"]);
  assert.equal(existing.name, "Atlas");
});
test("invoice lines group by reference and count an upfront payment once", () => {
  const plan = planSupplierInvoiceImport([input, { ...input, name: "Stylo", quantity: "3", unitPrice: "1,50", amountPaid: "5.50", total: "30,00", remaining: "24,50" }, { ...input, reference: "FA-002", amountPaid: "" }], supplier);
  assert.equal(plan.errorCount, 0); assert.equal(plan.createCount, 2);
  assert.equal(plan.documents[0].items.length, 2);
  assert.equal(plan.documents[0].total, 30); assert.equal(plan.documents[0].amountPaid, 5.5); assert.equal(plan.documents[0].remaining, 24.5);
  assert.equal(plan.documents[1].amountPaid, 0); assert.equal(plan.documents[1].remaining, 25.5);
  assert.equal(plan.documents[0].invoiceDate, "2026-10-13");
});
test("date and payment may be specified once for a multi-line invoice; existing references are skipped", () => {
  const plan = planSupplierInvoiceImport([input, { ...input, name: "Deuxième produit", invoiceDate: "", amountPaid: "" }, { ...input, reference: "OLD" }], supplier, [{ reference: "OLD", amountPaid: 999 }]);
  assert.equal(plan.errorCount, 0); assert.equal(plan.createCount, 1); assert.equal(plan.duplicateCount, 1);
  assert.equal(plan.documents[0].total, 51); assert.equal(plan.documents[0].amountPaid, 5.5);
  assert.equal(plan.rows[2].duplicate, "existing");
});
for (const [patch, code] of [
  [{ invoiceDate: "14/10/2026" }, "inconsistentInvoice"], [{ amountPaid: 6 }, "inconsistentInvoice"],
  [{ total: 20 }, "totalMismatch"], [{ remaining: 3 }, "totalMismatch"],
  [{ supplierName: "Other supplier" }, "wrongSupplier"], [{ supplierId: "other" }, "wrongSupplier"],
  [{ invoiceDate: "31/02/2026" }, "invalidDate"], [{ quantity: 0 }, "invalidQuantity"],
  [{ quantity: 1.2345 }, "invalidQuantity"], [{ unitPrice: -1 }, "invalidNumber"],
  [{ unitPrice: { formula: true } }, "formula"], [{ reference: "" }, "required"],
]) test(`invoice import reports ${code} for ${JSON.stringify(patch)}`, () => {
  const plan = planSupplierInvoiceImport([input, { ...input, ...patch, rowNumber: 42 }], supplier);
  assert.ok(plan.errorCount > 0); assert.ok(plan.rows.flatMap((row) => row.errors).some((error) => error.code === code));
});
test("overpayment and excessive lines per invoice are rejected", () => {
  assert.ok(planSupplierInvoiceImport([{ ...input, amountPaid: 100 }], supplier).rows[0].errors.some((error) => error.code === "overpayment"));
  assert.ok(planSupplierInvoiceImport(Array.from({ length: 201 }, () => input), supplier).rows[0].errors.some((error) => error.code === "invalidItems"));
});

test("ambiguous duplicate columns cannot silently choose a payment amount", () => {
  assert.throws(() => mapSupplierSheet({ headers: [...supplierImportHeaders.invoices, "Acompte"], rows: [] }, "invoices"), (error) => error.message === "ambiguousColumns" && error.fields.includes("amountPaid"));
});
for (const date1904 of [false, true]) test(`Excel date serials are imported without timezone shifts (1904=${date1904})`, () => {
  const worksheet = utils.aoa_to_sheet([supplierImportHeaders.invoices, ["FA-17", date1904 ? 44846 : 46308, "Produit", 2, "10,50", 5, 21, 16, supplier.name, supplier._id]]);
  worksheet.B2.z = "dd/mm/yyyy";
  const plan = planSupplierInvoiceImport(mapSupplierSheet(readSupplierWorkbook(bytes(worksheet, "xlsx", date1904), "invoices")[0], "invoices"), supplier);
  assert.equal(plan.errorCount, 0); assert.equal(plan.documents[0].invoiceDate, "2026-10-13");
});
test("formula cells, invalid contacts, headers, oversized sheets and blank input are rejected", () => {
  const worksheet = utils.aoa_to_sheet([supplierImportHeaders.suppliers, ["F1", "Name", "", "", ""]]); worksheet.B2 = { t: "str", v: "Name", f: '"Name"' };
  assert.equal(planSupplierImport(mapSupplierSheet(readSupplierWorkbook(bytes(worksheet), "suppliers")[0], "suppliers")).rows[0].errors[0].code, "formula");
  assert.ok(planSupplierImport([{ name: "Name", email: "bad", phone: "abc" }]).rows[0].errors.length === 2);
  assert.throws(() => planSupplierImport([]), /emptyFile/);
  assert.throws(() => planSupplierImport(Array(SUPPLIER_IMPORT_MAX_ROWS + 1).fill({ name: "Name" })), /tooManyRows/);
  assert.equal(readSupplierWorkbook(bytes(utils.aoa_to_sheet([["Unknown"], ["1"]])), "suppliers")[0].error, "missingHeader");
  assert.throws(() => mapSupplierSheet({ headers: ["Référence facture", "Produit"], rows: [] }, "invoices"), /missingColumns/);
});
