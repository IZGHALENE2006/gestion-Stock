import { readSupplierWorkbook } from "../../../shared/supplierWorkbook.js";

self.onmessage = ({ data }) => {
  try { self.postMessage({ sheets: readSupplierWorkbook(data.bytes, data.kind) }); }
  catch (error) { self.postMessage({ error: error.message }); }
};
