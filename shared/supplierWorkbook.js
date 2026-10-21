import { read, utils, SSF, set_cptable } from "xlsx";
import * as cptable from "xlsx/dist/cpexcel.full.mjs";
import { SUPPLIER_IMPORT_MAX_BYTES, SUPPLIER_IMPORT_MAX_ROWS, supplierImportColumns } from "./supplierImport.js";

set_cptable(cptable);

export function readSupplierWorkbook(bytes, kind) {
  if (!["suppliers", "invoices"].includes(kind)) throw new Error("invalidFile");
  if (!bytes?.byteLength || bytes.byteLength > SUPPLIER_IMPORT_MAX_BYTES) throw new Error("fileSize");
  let workbook;
  try { workbook = read(bytes, { type: "array", raw: true, codepage: 65001, cellNF: true, sheetRows: SUPPLIER_IMPORT_MAX_ROWS + 22 }); }
  catch { throw new Error("invalidFile"); }
  if (workbook.SheetNames.length > 20) throw new Error("tooManySheets");
  return workbook.SheetNames.map((name) => {
    const sheet = workbook.Sheets[name];
    if (!sheet?.["!ref"]) return { name, error: "emptyFile" };
    const range = utils.decode_range(sheet["!fullref"] || sheet["!ref"]);
    if (range.e.c >= 64) return { name, error: "tooManyColumns" };
    const grid = utils.sheet_to_json(sheet, { header: 1, defval: "", raw: true, blankrows: true });
    const headerIndex = grid.slice(0, 20).findIndex((row) => {
      const columns = supplierImportColumns(row, kind);
      return kind === "suppliers" ? columns.name >= 0 : columns.reference >= 0 && columns.name >= 0;
    });
    if (headerIndex < 0) return { name, error: "missingHeader" };
    if (range.e.r - (range.s.r + headerIndex) > SUPPLIER_IMPORT_MAX_ROWS) return { name, error: "tooManyRows" };
    const headers = grid[headerIndex], columns = supplierImportColumns(headers, kind);
    const rows = grid.slice(headerIndex + 1).flatMap((values, index) => {
      const rowNumber = range.s.r + headerIndex + index + 2;
      const cells = headers.map((_, col) => {
        const cell = sheet[utils.encode_cell({ r: rowNumber - 1, c: col + range.s.c })];
        if (cell?.f) return { formula: true };
        if (col === columns.invoiceDate && typeof cell?.v === "number") {
          const date = SSF.parse_date_code(cell.v, { date1904: Boolean(workbook.Workbook?.WBProps?.date1904) });
          return date ? `${String(date.y).padStart(4, "0")}-${String(date.m).padStart(2, "0")}-${String(date.d).padStart(2, "0")}` : "invalid";
        }
        if ([columns.phone, columns.externalCode, columns.reference, columns.supplierId].includes(col) && typeof cell?.v === "number" && /^\d+$/.test(cell.w || "")) return cell.w;
        return values[col] ?? "";
      });
      return cells.some((value) => String(value).trim() !== "") ? [{ rowNumber, cells }] : [];
    });
    return { name, headers, rows, ...(rows.length ? {} : { error: "emptyFile" }) };
  });
}
