import { roundMoney } from "./saleTotals.js";

export const PRODUCT_IMPORT_MAX_ROWS = 2000;
export const PRODUCT_IMPORT_MAX_BYTES = 5 * 1024 * 1024;
export const normalizeImportText = (value) => String(value ?? "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[’']/g, "").replace(/[^a-z0-9\u0600-\u06ff]+/g, " ").trim();
const aliases = {
  code_article: ["code article", "reference", "reference article"],
  name: ["libelle", "designation", "nom", "nom du produit", "produit"],
  type_article: ["type darticle", "type article"],
  categoryName: ["categories", "categorie"],
  prix_vente: ["pv ht", "prix de vente", "prix vente", "prix de vente ht"],
  prix_gros: ["prix gros", "prix de gros"],
  prix_achat: ["prix achat", "prix dachat"],
  stock: ["stock", "quantite", "quantite en stock"],
  barcode: ["code barre", "code barres", "code a barres", "barcode"],
  stock_virtuel: ["stock virtuel"],
  stock_reel: ["stock reel"],
  status: ["statut", "status"],
  fournisseur: ["fournisseur"],
};
export const importColumns = (headers) => {
  const normalized = headers.map(normalizeImportText);
  return Object.fromEntries(Object.entries(aliases).map(([key, names]) => [key, normalized.findIndex((name) => names.includes(name))]));
};

const fail = (message) => { throw new Error(message); };
const empty = (value) => value === undefined || value === null || value === "";
export function parseImportNumber(value) {
  if (typeof value === "number") return Number.isFinite(value) && value >= 0 && value <= 1e12 ? value : fail("invalidNumber");
  if (typeof value !== "string" || !value.trim()) return fail("invalidNumber");
  let text = value.trim().replace(/(?:€|MAD|DH)/gi, "").replace(/[\s\u00a0\u202f]/g, "");
  if (text.includes(",")) {
    if (!/^\d+(?:\.\d{3})*,\d+$/.test(text)) return fail("invalidNumber");
    text = text.replace(/\./g, "").replace(",", ".");
  }
  if (!/^\d+(?:\.\d+)?$/.test(text)) return fail("invalidNumber");
  return parseImportNumber(Number(text));
}

function textValue(value, max, required = false) {
  if (empty(value)) return required ? fail("required") : "";
  if (typeof value !== "string" && typeof value !== "number") return fail("invalidText");
  if (typeof value === "number" && !Number.isSafeInteger(value)) return fail("invalidIdentifier");
  const text = String(value).trim();
  if (required && !text) return fail("required");
  if (text.length > max || [...text].some((char) => char.charCodeAt(0) < 32)) return fail("invalidText");
  return text;
}

export function validateProductImportRow(row) {
  const data = {}, errors = [];
  const field = (key, parse) => {
    try { data[key] = parse(row?.[key]); } catch (error) { errors.push({ field: key, code: row?.[key]?.formula ? "formula" : error.message }); }
  };
  field("name", (value) => textValue(value, 300, true));
  field("categoryName", (value) => textValue(value, 160, true));
  for (const key of ["code_article", "barcode"]) field(key, (value) => {
    const result = textValue(value, 80);
    if (/[eE][+-]\d+$/.test(result) || /[^\x20-\x7e]/.test(result)) return fail("invalidIdentifier");
    return result;
  });
  field("type_article", (value) => textValue(value, 80));
  field("fournisseur", (value) => textValue(value, 160));
  for (const key of ["prix_vente", "prix_achat", "prix_gros"]) field(key, (value) => {
    if (empty(value) && key !== "prix_vente") return key === "prix_gros" ? null : 0;
    return roundMoney(parseImportNumber(value));
  });
  for (const key of ["quantite", "stock_virtuel", "stock_reel"]) field(key, (value) => {
    if (empty(value) && key !== "quantite") return undefined;
    const number = parseImportNumber(value);
    if (!Number.isSafeInteger(number)) return fail("invalidQuantity");
    return number;
  });
  field("status", (value) => {
    if (empty(value)) return true;
    if (typeof value === "boolean") return value;
    const normalized = normalizeImportText(value);
    if (["actif", "active", "1", "true"].includes(normalized)) return true;
    if (["inactif", "inactive", "0", "false"].includes(normalized)) return false;
    return fail("invalidStatus");
  });
  const barcodeFromArticle = !data.barcode && Boolean(data.code_article);
  if (barcodeFromArticle) data.barcode = data.code_article;
  if (!data.barcode && !errors.some((error) => ["barcode", "code_article"].includes(error.field))) errors.push({ field: "barcode", code: "missingIdentifier" });
  return { data, errors, barcodeFromArticle };
}

export function planProductImport(input, products = []) {
  if (!Array.isArray(input) || input.length === 0) return fail("emptyFile");
  if (input.length > PRODUCT_IMPORT_MAX_ROWS) return fail("tooManyRows");
  const barcodeSet = new Set(products.map((item) => String(item.barcode || "").trim()).filter(Boolean));
  const articleSet = new Set(products.map((item) => String(item.code_article || "").trim().toLowerCase()).filter(Boolean));
  const fileBarcodes = new Set(), fileArticles = new Set();
  const rows = input.map((row, index) => {
    const result = validateProductImportRow(row);
    const { barcode, code_article } = result.data;
    const article = (code_article || "").toLowerCase();
    const duplicate = barcodeSet.has(barcode) || (article && articleSet.has(article)) ? "existing"
      : fileBarcodes.has(barcode) || (article && fileArticles.has(article)) ? "file" : "";
    if (!result.errors.length) { fileBarcodes.add(barcode); if (article) fileArticles.add(article); }
    return { ...result, rowNumber: Number.isSafeInteger(row?.rowNumber) && row.rowNumber > 0 ? row.rowNumber : index + 2, duplicate };
  });
  return { rows, createCount: rows.filter((row) => !row.errors.length && !row.duplicate).length,
    errorCount: rows.filter((row) => row.errors.length).length,
    duplicateCount: rows.filter((row) => row.duplicate).length };
}

export function mapProductSheet(sheet, { stockColumn = "stock", categoryName = "" } = {}) {
  const columns = importColumns(sheet.headers);
  const required = ["name", "prix_vente", stockColumn, ...(!categoryName ? ["categoryName"] : [])];
  const missing = required.filter((key) => columns[key] === undefined || columns[key] < 0);
  if (columns.barcode < 0 && columns.code_article < 0) missing.push("barcode");
  if (missing.length) throw Object.assign(new Error("missingColumns"), { fields: missing });
  return sheet.rows.map(({ rowNumber, cells }) => ({
    rowNumber, ...Object.fromEntries(Object.entries(columns).map(([key, index]) => [key, index < 0 ? "" : cells[index] ?? ""])),
    categoryName: categoryName || cells[columns.categoryName] || "", quantite: cells[columns[stockColumn]],
  }));
}
