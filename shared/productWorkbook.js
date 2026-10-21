import { read, utils, set_cptable } from "xlsx";
import * as cptable from "xlsx/dist/cpexcel.full.mjs";
import { importColumns, PRODUCT_IMPORT_MAX_ROWS, PRODUCT_IMPORT_MAX_BYTES } from "./productImport.js";

set_cptable(cptable);

export function readProductWorkbook(bytes) {
  if (!bytes?.byteLength || bytes.byteLength > PRODUCT_IMPORT_MAX_BYTES) throw new Error("fileSize");
  let workbook;
  try { workbook = read(bytes, { type: "array", raw: true, codepage: 65001, cellNF: true, sheetRows: PRODUCT_IMPORT_MAX_ROWS + 22 }); }
  catch { throw new Error("invalidFile"); }
  if (workbook.SheetNames.length > 20) throw new Error("tooManySheets");
  return workbook.SheetNames.map((name) => {
    const sheet = workbook.Sheets[name];
    if (!sheet?.["!ref"]) return { name, error: "emptyFile" };
    const range = utils.decode_range(sheet["!fullref"] || sheet["!ref"]);
    if (range.e.c >= 64) return { name, error: "tooManyColumns" };
    const grid = utils.sheet_to_json(sheet, { header: 1, defval: "", raw: true, blankrows: true });
    const headerIndex = grid.slice(0, 20).findIndex((row) => importColumns(row).name >= 0);
    if (headerIndex < 0) return { name, error: "missingHeader" };
    if (range.e.r - (range.s.r + headerIndex) > PRODUCT_IMPORT_MAX_ROWS) return { name, error: "tooManyRows" };
    const headers = grid[headerIndex];
    const columns = importColumns(headers);
    const rows = grid.slice(headerIndex + 1).flatMap((values, index) => {
      const rowNumber = range.s.r + headerIndex + index + 2;
      const cells = headers.map((_, col) => {
        const cell = sheet[utils.encode_cell({ r: rowNumber - 1, c: col + range.s.c })];
        if (cell?.f) return { formula: true };
        if ([columns.barcode, columns.code_article].includes(col) && typeof cell?.v === "number" && /^\d+$/.test(cell.w || "")) return cell.w;
        return values[col] ?? "";
      });
      return cells.some((value) => String(value).trim() !== "") ? [{ rowNumber, cells }] : [];
    });
    return { name, headers, rows, ...(rows.length ? {} : { error: "emptyFile" }) };
  });
}
