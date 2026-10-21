import test from "node:test";
import assert from "node:assert/strict";
import { utils, write } from "xlsx";
import { readProductWorkbook } from "../shared/productWorkbook.js";
import { mapProductSheet, planProductImport, parseImportNumber, PRODUCT_IMPORT_MAX_ROWS } from "../shared/productImport.js";

const headers = ["Code article", "Libellé", "Type d'article", "Catégories", "PV HT", "Prix gros", "Prix achat", "Stock", "Code barre", "Stock virtuel", "Stock réel", "Statut"];
const values = ["AR00918", "Stylo محمد", "Bien", "Les fournitures scolaires", "1,50", "1,22 €", "0,00 €", "728,00", "070330129665", "0,00", "200,00", "Actif"];
const bytes = (sheet, bookType = "xlsx") => {
  const book = utils.book_new(); utils.book_append_sheet(book, sheet, "Produits");
  return write(book, { type: "array", bookType });
};
const row = () => ({ name: "Produit", categoryName: "École", prix_vente: "10,00", prix_achat: 0, prix_gros: "", quantite: 10, barcode: "001234567890", code_article: "AR001", status: "Actif" });

for (const format of ["xlsx", "xls"]) test(`${format} imports screenshot columns, Arabic, decimal commas and leading zeros`, () => {
  const [sheet] = readProductWorkbook(bytes(utils.aoa_to_sheet([headers, values]), format));
  const plan = planProductImport(mapProductSheet(sheet));
  assert.equal(plan.errorCount, 0); assert.equal(plan.createCount, 1);
  assert.deepEqual(plan.rows[0].data, { name: "Stylo محمد", categoryName: "Les fournitures scolaires", code_article: "AR00918", barcode: "070330129665", type_article: "Bien", fournisseur: "", prix_vente: 1.5, prix_gros: 1.22, prix_achat: 0, quantite: 728, stock_virtuel: 0, stock_reel: 200, status: true });
  assert.equal(planProductImport(mapProductSheet(sheet, { stockColumn: "stock_reel" })).rows[0].data.quantite, 200);
});

test("CSV preserves UTF-8 Arabic, quoted separators and identifiers", () => {
  const csv = "\ufeff" + headers.join(";") + "\r\n" + values.map((value, index) => index === 1 ? '"Stylo; محمد"' : value).join(";");
  const [sheet] = readProductWorkbook(new TextEncoder().encode(csv));
  const result = planProductImport(mapProductSheet(sheet));
  assert.equal(result.errorCount, 0); assert.equal(result.rows[0].data.name, "Stylo; محمد");
  assert.equal(result.rows[0].data.barcode, "070330129665");
});

test("UTF-8 CSV without a BOM and a worksheet offset preserve source data", () => {
  const csv = headers.join(";") + "\n" + values.join(";");
  const parsed = planProductImport(mapProductSheet(readProductWorkbook(new TextEncoder().encode(csv))[0]));
  assert.equal(parsed.rows[0].data.name, "Stylo محمد");
  const sheet = utils.aoa_to_sheet([]);
  utils.sheet_add_aoa(sheet, [headers, values], { origin: "C5" });
  const parsedOffset = readProductWorkbook(bytes(sheet))[0];
  assert.equal(parsedOffset.rows[0].rowNumber, 6);
  assert.equal(planProductImport(mapProductSheet(parsedOffset)).rows[0].data.barcode, "070330129665");
});

test("numeric barcode keeps format padding and formulas require values", () => {
  const sheet = utils.aoa_to_sheet([headers, values]);
  sheet.I2 = { t: "n", v: 70330129665, z: "000000000000" };
  let result = planProductImport(mapProductSheet(readProductWorkbook(bytes(sheet))[0]));
  assert.equal(result.rows[0].data.barcode, "070330129665");
  sheet.E2 = { t: "n", v: 2, f: "1+1" };
  result = planProductImport(mapProductSheet(readProductWorkbook(bytes(sheet))[0]));
  assert.deepEqual(result.rows[0].errors, [{ field: "prix_vente", code: "formula" }]);
});

test("blank lines and a title retain exact Excel row numbers and article fallback", () => {
  const sheet = utils.aoa_to_sheet([["Catalogue"], [], headers, values, [], [...values.slice(0, 8), "", ...values.slice(9)]]);
  const imported = readProductWorkbook(bytes(sheet))[0];
  assert.deepEqual(imported.rows.map((item) => item.rowNumber), [4, 6]);
  const result = planProductImport(mapProductSheet(imported));
  assert.equal(result.rows[1].barcodeFromArticle, true); assert.equal(result.rows[1].data.barcode, "AR00918");
  assert.equal(result.rows[1].duplicate, "file");
});

test("numbers accept French currency and reject ambiguous or invalid values", () => {
  for (const value of ["1 234,56 €", "1\u202f234,56 DH", "1.234,56", 1234.56, "1234.56"]) assert.equal(parseImportNumber(value), 1234.56);
  for (const value of ["", null, true, -1, "-1", "1,2,3", "12junk", "NaN", "1e6", "1.234.567", [], 1e15]) assert.throws(() => parseImportNumber(value), /invalidNumber/);
});

test("duplicates match barcode or article and leave current stock intact", () => {
  const existing = [{ barcode: "001234567890", code_article: "OLD", quantite: 50 }];
  const plan = planProductImport([row(), { ...row(), barcode: "2", code_article: "old" }, { ...row(), barcode: "3", code_article: "new" }, { ...row(), barcode: "3", code_article: "different" }], existing);
  assert.deepEqual(plan.rows.map((item) => item.duplicate), ["existing", "existing", "", "file"]);
  assert.equal(plan.createCount, 1); assert.equal(plan.duplicateCount, 3); assert.equal(existing[0].quantite, 50);
});

test("invalid fields report per-line errors", () => {
  const invalid = [[{ name: "" }, "name"], [{ categoryName: "" }, "categoryName"], [{ quantite: "1,5" }, "quantite"], [{ prix_vente: "" }, "prix_vente"], [{ prix_gros: -10 }, "prix_gros"], [{ barcode: "", code_article: "" }, "barcode"], [{ status: "maybe" }, "status"], [{ barcode: "6.12E+15" }, "barcode"], [{ barcode: 9007199254740992 }, "barcode"]];
  for (const [patch, field] of invalid) {
    const plan = planProductImport([{ ...row(), ...patch }]);
    assert.equal(plan.createCount, 0); assert.equal(plan.errorCount, 1); assert.ok(plan.rows[0].errors.some((error) => error.field === field));
  }
});

test("category override supports files without categories; chosen stock must exist", () => {
  const sheet = { headers: ["Libellé", "PV HT", "Stock réel", "Code article"], rows: [{ rowNumber: 2, cells: ["Test", 5, 10, "X"] }] };
  assert.throws(() => mapProductSheet(sheet), /missingColumns/);
  const result = planProductImport(mapProductSheet(sheet, { stockColumn: "stock_reel", categoryName: "Divers" }));
  assert.equal(result.errorCount, 0); assert.equal(result.rows[0].data.categoryName, "Divers");
  assert.equal(result.rows[0].data.prix_gros, null); assert.equal(result.rows[0].data.prix_achat, 0);
});

test("oversized and headerless sheets are rejected without truncation", () => {
  assert.throws(() => planProductImport([]), /emptyFile/);
  assert.throws(() => planProductImport(Array(PRODUCT_IMPORT_MAX_ROWS + 1).fill(row())), /tooManyRows/);
  assert.equal(readProductWorkbook(bytes(utils.aoa_to_sheet([["Not a catalogue"]])))[0].error, "missingHeader");
  const sheet = utils.aoa_to_sheet([headers, ...Array(PRODUCT_IMPORT_MAX_ROWS + 1).fill(values)]);
  assert.equal(readProductWorkbook(bytes(sheet))[0].error, "tooManyRows");
});
